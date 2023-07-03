import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import { ChakraProvider } from "@chakra-ui/react";
import { GameProvider } from "./hooks/gameData";

const App = () => (
  <BrowserRouter>
    <GameProvider>
      <ChakraProvider>
        <Routes />
      </ChakraProvider>
    </GameProvider>
  </BrowserRouter>
);

export default App;
