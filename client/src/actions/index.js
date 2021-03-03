import { GET_POKEMONS, GET_POKEMONS_TYPES, GET_POKEMON_DETAIL, ORDER_POKEMONS_BY_NAME, FILTER_BY_PERSONALIZATION, FILTER_BY_TYPE} from './types'

export function getPokemons(offset, limit) {
  console.log('actions get pokemons')
  return function(dispatch) {
    return fetch(`http://localhost:3002/pokemons/?offset=${offset}&limit=${limit}`)  // change fetch to keep pagiantion adding offset and limit
      .then(response => response.json())
      .then(json => {
        dispatch({ type: GET_POKEMONS, payload: json })
      })
      .catch((error) => console.log(error))
      ;
  };
}

export function getPokemonsDetail(id) {
  console.log('acction get detail')
  return function(dispatch) {
    return fetch(`http://localhost:3002/pokemons/${id}`)
      .then(response => response.json())
      .then(json => {
        dispatch({ type: GET_POKEMON_DETAIL, payload: json });
      })
      .catch((error) => console.log(error))
      ;
  }
}

export function getTypes() {
  console.log('acction get Types')
  return function(dispatch) {
    return fetch(`http://localhost:3002/types/`)
      .then(response => response.json())
      .then(json => {
        dispatch({ type: GET_POKEMONS_TYPES, payload: json });
      })
      
  };
}

export function sortPokemons(pokemons, sort) {
  console.log('estoy ordenando' + sort)
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
  console.log('estoy filtrando' + filter)
  return function(dispatch){
    dispatch({type: FILTER_BY_PERSONALIZATION, payload: filter})
  }
} 

export function filterByType(filter) {
  console.log('estoy filtrando' + filter)
  return function(dispatch){
    dispatch({type: FILTER_BY_TYPE, payload: filter})
  }
} 