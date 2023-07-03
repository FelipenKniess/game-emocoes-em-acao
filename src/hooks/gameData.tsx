import { createContext, useContext, useState } from "react";
import { getDataCardsEasy, getDataCardsMedium } from "../utils/getDataCards";
import {
  getColorsCardsMedium,
  getColorsCardsEasy,
} from "../utils/getColorCards";
import { WheelData } from "react-custom-roulette/dist/components/Wheel/types";

export interface Jogador {
  id: number;
  nome: string;
  pontuacaoAtual: number;
}

export interface InfoGame {
  idJogadorAtual: number;
  nomeJogadorAtual: string;
}

interface GameContextData {
  jogadoresNoJogo: Jogador[];
  cardsGame?: CardsGame[];
  infoGame?: InfoGame;
  colorsGame?: WheelData[];
  comecarJogo: (Jogadores: Jogador[], dificuldade: number) => void;
  setInfoGame: (infoGame: InfoGame) => void;
  atualizarPontosJogador: (idJogador: number) => void;
  atualizarJogadorAtual: () => void;
  removerCarta: (idCarta: number) => void;
  setColorsGame: (colors: WheelData[]) => void;
  limparDados: () => void;
}

export interface CardsGame {
  id: number;
  phrase: string;
  points: number;
  idColor: number;
  isSelected: boolean;
}

interface GameProviderProps {
  children: JSX.Element;
}

const GameContext = createContext<GameContextData>({} as GameContextData);

export const GameProvider = ({ children }: GameProviderProps) => {
  const [jogadoresNoJogo, setJogadoresNoJogo] = useState<Jogador[]>([]);
  const [infoGame, setInfoGame] = useState<InfoGame>();
  const [cardsGame, setCardsGame] = useState<CardsGame[]>();
  const [colorsGame, setColorsGame] = useState<WheelData[]>();

  function comecarJogo(jogadores: Jogador[], dificuldade: number) {
    setJogadoresNoJogo(jogadores);

    if (Number(dificuldade) === 1) {
      setCardsGame(getDataCardsEasy());
      setColorsGame(getColorsCardsEasy());
    } else {
      setCardsGame(getDataCardsMedium());
      setColorsGame(getColorsCardsMedium());
    }

    // setColorsGame([
    //   {
    //     option: "0",
    //     style: { backgroundColor: "#FEB125", textColor: "#FEB125" },
    //   },
    //   {
    //     option: "1",
    //     style: { backgroundColor: "#004AAD", textColor: "#004AAD" },
    //   },
    //   {
    //     option: "2",
    //     style: { backgroundColor: "#ED443B", textColor: "#ED443B" },
    //   },
    // ]);

    // setCardsGame([
    //   {
    //     id: 1,
    //     phrase: "QUAL O MOMENTO MAIS ALEGRE DA SUA VIDA?",
    //     points: 22,
    //     idColor: 0,
    //     isSelected: false,
    //   },
    //   {
    //     id: 7,
    //     phrase: "QUAL O MOMENTO MAIS TRISTE DA SUA VIDA?",
    //     points: 22,
    //     idColor: 1,
    //     isSelected: false,
    //   },
    //   {
    //     id: 16,
    //     phrase: "QUAL O MOMENTO DA SUA VIDA EM QUE VOCÊ MAIS SENTIU RAIVA?",
    //     points: 22,
    //     idColor: 2,
    //     isSelected: false,
    //   },
    // ]);

    setInfoGame({
      idJogadorAtual: jogadores[0].id,
      nomeJogadorAtual: jogadores[0].nome,
    });
  }

  function limparDados() {
    setJogadoresNoJogo([]);
    setInfoGame(undefined);
    setCardsGame([]);
    setColorsGame([]);
  }

  function atualizarPontosJogador(idJogador: number) {
    const newJogadores = jogadoresNoJogo.map((item) => {
      if (idJogador === item.id) {
        return {
          ...item,
          pontuacaoAtual: item.pontuacaoAtual + 1,
        };
      }
      return item;
    });

    setJogadoresNoJogo(newJogadores);
  }

  function atualizarJogadorAtual() {
    if (!infoGame) return;

    const findNextPlayer = jogadoresNoJogo
      .sort((a, b) => a.id - b.id)
      .find((item) => item.id === infoGame.idJogadorAtual + 1);

    if (findNextPlayer) {
      setInfoGame({
        idJogadorAtual: findNextPlayer.id,
        nomeJogadorAtual: findNextPlayer.nome,
      });
    } else {
      setInfoGame({
        idJogadorAtual: jogadoresNoJogo[0].id,
        nomeJogadorAtual: jogadoresNoJogo[0].nome,
      });
    }
  }

  function removerCarta(idCarta: number) {
    const newCards = cardsGame?.map((item) => {
      if (item.id === idCarta) {
        return {
          ...item,
          isSelected: true,
        };
      }
      return item;
    });

    setCardsGame(newCards);
  }

  return (
    <GameContext.Provider
      value={{
        jogadoresNoJogo,
        comecarJogo,
        infoGame,
        setInfoGame,
        cardsGame,
        colorsGame,
        atualizarPontosJogador,
        atualizarJogadorAtual,
        removerCarta,
        setColorsGame,
        limparDados,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useGameData(): GameContextData {
  const context = useContext(GameContext);

  return context;
}
