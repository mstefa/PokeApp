import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from './store/index'
import LandingPage from './components/LandingPage'
import NavBar from './components/NavBar';
import './App.css';
import Pokemons from './components/Pokemons';
import PokemonDetail from './components/PokemonDetail';
import CreatePokemon from './components/CreatePokemon';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter> 
            <Route path="/" component={NavBar} />
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/home" component={Pokemons} />
            <Route path="/pokemon/:id" component={PokemonDetail} />
            <Route path="/create" component={CreatePokemon} />
      </BrowserRouter>
    </Provider>

  );
}

export default App;
