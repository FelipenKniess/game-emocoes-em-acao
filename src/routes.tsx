import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import sorteioCores from "./pages/SorteioCores";
import SelecionarCartas from "./pages/SelecionarCartas";

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/sorteio-cores" component={sorteioCores} />
    <Route path="/selecao-cartas/:id" component={SelecionarCartas} />
  </Switch>
);

export default Routes;
