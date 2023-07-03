import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Container,
  Text,
  Box,
  Input,
  Button,
  Image,
  Select,
} from "@chakra-ui/react";

import "./styles.scss";
import { useState, useEffect } from "react";
import { useGameData, Jogador } from "../../hooks/gameData";
import { useHistory } from "react-router-dom";
import logo from "../../assets/logo.png";

function Home() {
  const [jogadores, setJogadores] = useState([
    {
      id: 1,
      nome: "",
    },
    {
      id: 2,
      nome: "",
    },
  ]);

  const [dificuldade, setDificuldade] = useState<number | undefined>();

  const history = useHistory();
  const { comecarJogo, limparDados } = useGameData();

  useEffect(() => {
    limparDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addNovoJogador(qtdJogadores: string) {
    const jogadoresAdd = [];
    for (let i = 0; i < parseInt(qtdJogadores); i++) {
      const findJogador = jogadores.find((jogador) => jogador.id === i + 1);
      jogadoresAdd.push({
        id: i + 1,
        nome: findJogador ? findJogador.nome : "",
      });
    }

    setJogadores(jogadoresAdd);
  }

  function handleClickStartGame() {
    const newJogadores: Jogador[] = jogadores.map((jogador) => {
      return {
        id: jogador.id,
        nome: jogador.nome,
        pontuacaoAtual: 0,
      };
    });

    const temJogadoresSemNome = newJogadores.find((jogador) => !jogador.nome);

    if (!dificuldade || temJogadoresSemNome) {
      return;
    }

    comecarJogo(newJogadores, dificuldade);
    history.push("/sorteio-cores");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateJogador(idJogador: number, event: any) {
    const jogadoresAtualizados = jogadores.map((jogador) => {
      if (jogador.id === idJogador) {
        return {
          id: idJogador,
          nome: event.target.value,
        };
      }
      return jogador;
    });
    setJogadores(jogadoresAtualizados);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChangeMode(event: any) {
    setDificuldade(event.target.value);
  }

  return (
    <>
      <Container centerContent marginTop={15}>
        <Image src={logo} width={800} />
      </Container>
      <Container className="container-home" gap={4} centerContent>
        <Box>
          <Text textAlign="center" marginTop={15} fontSize={14}>
            DIFICULDADE
          </Text>
          <Select
            placeholder="Selecione a dificuldade"
            onChange={handleChangeMode}
          >
            <option value="1">Fácil</option>
            <option value="2">Médio</option>
          </Select>
          <Text textAlign="center" marginTop={15} fontSize={14}>
            QUANTIDADE DE JOGADORES
          </Text>
          <NumberInput
            defaultValue={jogadores.length}
            min={2}
            max={4}
            onChange={addNovoJogador}
          >
            <NumberInputField disabled />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
        {jogadores.map((jogador) => (
          <Box key={jogador.id}>
            <Text textAlign="center" fontSize={14}>
              JOGADOR n°{jogador.id}
            </Text>
            <Input
              onChange={(val) => updateJogador(jogador.id, val)}
              placeholder={`Nome do jogador n°${jogador.id}`}
            />
          </Box>
        ))}
        <Box display="flex" gap={5}>
          <Button colorScheme="green" onClick={handleClickStartGame}>
            Começar jogo
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Home;
