import {
  Container,
  Button,
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect } from "react";
import "./styles.scss";
import { Wheel } from "react-custom-roulette";
import { useState } from "react";
import { useGameData } from "../../hooks/gameData";
import { useHistory } from "react-router-dom";

function SorteioCores() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [colorNumber, setColorNumber] = useState(0);
  const { infoGame, colorsGame, jogadoresNoJogo, cardsGame, setColorsGame } =
    useGameData();
  const history = useHistory();

  useEffect(() => {
    if (!infoGame?.idJogadorAtual) {
      history.push("/");
    }

    verificaVencedor();
    verificaExistenciaCor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, infoGame?.idJogadorAtual]);

  function verificaVencedor() {
    const existCardAvailable = cardsGame?.find((card) => !card.isSelected);
    if (!existCardAvailable && jogadoresNoJogo.length) {
      const jogadores = jogadoresNoJogo.sort(
        (a, b) => b.pontuacaoAtual - a.pontuacaoAtual
      );
      history.push("/");
      alert(`O vencedor do jogo é: ${jogadores[0].nome}`);
    }
  }

  function verificaExistenciaCor() {
    const filterColor = colorsGame?.filter((color) => {
      const existCardWithColor = cardsGame?.find(
        (card) => card.idColor === Number(color.option) && !card.isSelected
      );

      if (existCardWithColor) {
        return color;
      }
    });

    if (filterColor) {
      setColorsGame(filterColor);
    }
  }

  function handleSpinClick() {
    if (!mustSpin && colorsGame) {
      const optionsColors = colorsGame.map((color) => Number(color.option));
      const indiceAleatorio = Math.floor(Math.random() * optionsColors.length);
      const numeroAleatorio = optionsColors[indiceAleatorio];
      const findIndexColor = optionsColors.findIndex(
        (color) => color === numeroAleatorio
      );
      setPrizeNumber(findIndexColor);
      setColorNumber(numeroAleatorio);

      if (optionsColors.length === 1) {
        history.push(`/selecao-cartas/${numeroAleatorio}`);
        return;
      }

      setMustSpin(true);
    }
  }

  function onStopRoulette() {
    setMustSpin(false);
    setTimeout(() => {
      history.push(`/selecao-cartas/${colorNumber}`);
    }, 2000);
  }

  function handleResetGame() {
    history.push("/");
  }

  return (
    <Container className="container-sorteio" gap={4} centerContent>
      <Button colorScheme="red" onClick={handleResetGame}>
        Resetar jogo
      </Button>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Colocação</Th>
              <Th>Nome Jogador</Th>
              <Th isNumeric>Pontuação</Th>
            </Tr>
          </Thead>
          <Tbody>
            {jogadoresNoJogo
              .sort((a, b) => b.pontuacaoAtual - a.pontuacaoAtual)
              .map((jogador, index) => (
                <Tr key={jogador.id}>
                  <Td>{index + 1}°</Td>
                  <Td>{jogador.nome}</Td>
                  <Td isNumeric>{jogador.pontuacaoAtual}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Text fontSize={22}>
        É a vez de <strong>{infoGame?.nomeJogadorAtual}</strong>
      </Text>
      {colorsGame && (
        <>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={colorsGame}
            onStopSpinning={onStopRoulette}
            spinDuration={0.4}
          />
          <Button
            colorScheme="green"
            isDisabled={mustSpin}
            onClick={handleSpinClick}
          >
            GIRAR ROLETA
          </Button>
        </>
      )}
    </Container>
  );
}

export default SorteioCores;
