import { GET_POKEMONS, GET_POKEMONS_TYPES, GET_POKEMON_DETAIL, ORDER_POKEMONS_BY_NAME, FILTER_BY_PERSONALIZATION, FILTER_BY_TYPE} from './types'

let baseURL= process.env.REACT_APP_API;
baseURL = baseURL || 'http://localhost:3002';

export function getPokemons(offset, limit) {
 
  return function(dispatch) {
    return fetch(`${baseURL}/pokemons/?offset=${offset}&limit=${limit}`)  // change fetch to keep pagiantion adding offset and limit
      .then(response => response.json())
      .then(json => {
        dispatch({ type: GET_POKEMONS, payload: json })
      })
      .catch((error) => console.error(error))
      ;
  };
}

export function getPokemonsDetail(id) {
  
  return function(dispatch) {
    return fetch(`${baseURL}/pokemons/${id}`)
      .then(response => response.json())
      .then(json => {
        dispatch({ type: GET_POKEMON_DETAIL, payload: json });
      })
      .catch((error) => console.error(error))
      ;
  }
}

export function getTypes() {
  
  return function(dispatch) {
    return fetch(`${baseURL}/types/`)
      .then(response => response.json())
      .then(json => {
        dispatch({ type: GET_POKEMONS_TYPES, payload: json });
      })
      
  };
}

export function sortPokemons(pokemons, sort) {
  
  let sortPokemons = pokemons.slice();
  return function(dispatch){
    if(sort === 'asc'){
      sortPokemons.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;});
    }
    if(sort === 'desc'){
      sortPokemons.sort(function(a, b){
        if(a.name > b.name) { return -1; }
        if(a.name < b.name) { return 1; }
        return 0;});
    }

    dispatch({type: ORDER_POKEMONS_BY_NAME, payload: sortPokemons})
  }
  
} 

export function filterByPersonalization(filter) {
  
  return function(dispatch){
    dispatch({type: FILTER_BY_PERSONALIZATION, payload: filter})
  }
} 

export function filterByType(filter) {
  
  return function(dispatch){
    dispatch({type: FILTER_BY_TYPE, payload: filter})
  }
} 