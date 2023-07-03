import {
  Card,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./styles.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import { CardsGame, useGameData } from "../../hooks/gameData";
import { WheelData } from "react-custom-roulette/dist/components/Wheel/types";

interface CardsParams {
  id: string;
}

function SelecionarCartas() {
  const { params } = useRouteMatch<CardsParams>();
  const {
    colorsGame,
    infoGame,
    cardsGame,
    atualizarJogadorAtual,
    atualizarPontosJogador,
    removerCarta,
  } = useGameData();
  const [colorSelected, setColorSelected] = useState<WheelData>();
  const [cardsCurrentColor, setCardsCurrentColor] = useState<CardsGame[]>();
  const [selectedCard, setSelectedCard] = useState<CardsGame>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  useEffect(() => {
    if (!infoGame?.idJogadorAtual) {
      history.push("/");
    }

    const findColorSelected = colorsGame?.find(
      (color) => color.option === params.id
    );

    const getCurrentColors = cardsGame?.filter(
      (card) => card.idColor === Number(params.id) && !card.isSelected
    );

    setCardsCurrentColor(getCurrentColors);

    if (findColorSelected) setColorSelected(findColorSelected);
  }, [cardsGame, colorsGame, history, infoGame?.idJogadorAtual, params.id]);

  function handleSelectCard(card: CardsGame) {
    setSelectedCard(card);
    onOpen();
  }

  function handleSuccessResponse() {
    if (!infoGame) return;
    atualizarPontosJogador(infoGame.idJogadorAtual);
    atualizarJogadorAtual();
    if (selectedCard) removerCarta(selectedCard.id);
    history.push("/sorteio-cores");
  }

  function handleFailResponse() {
    atualizarJogadorAtual();
    if (selectedCard) removerCarta(selectedCard.id);
    history.push("/sorteio-cores");
  }

  return (
    <>
      <div className="container-selecionarCartas">
        <Text fontSize={25} marginTop={10} textAlign="center">
          Selecione uma carta jogador:{" "}
          <strong>{infoGame?.nomeJogadorAtual}</strong>
        </Text>
        <Flex margin={50} gap={6} flexWrap="wrap" justifyContent="center">
          {cardsCurrentColor?.map((card) => (
            <Card
              className="card"
              background={colorSelected?.style?.backgroundColor}
              cursor="pointer"
              key={card.id}
              width={150}
              height={180}
              onClick={() => handleSelectCard(card)}
            ></Card>
          ))}
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text textAlign="center">RESPONDA A PERGUNTA</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text
                color={colorSelected?.style?.backgroundColor}
                textAlign="center"
                fontWeight="bold"
              >
                {selectedCard?.phrase}
              </Text>
            </ModalBody>

            <ModalFooter justifyContent="center">
              <Button
                colorScheme="green"
                mr={3}
                onClick={handleSuccessResponse}
              >
                Respondeu
              </Button>
              <Button colorScheme="red" mr={3} onClick={handleFailResponse}>
                Não Respondeu
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

export default SelecionarCartas;
