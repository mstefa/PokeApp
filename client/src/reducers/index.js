import { GET_POKEMONS, GET_POKEMONS_TYPES, GET_POKEMON_DETAIL, ORDER_POKEMONS_BY_NAME, FILTER_BY_PERSONALIZATION, FILTER_BY_TYPE} from '../actions/types'

const initialState = {
  pokemonsCount: 0,
  isFilterByPersonalization: false,
  isFilterByType: 'all',
  pokemonsLoaded: [],
  pokemonsTypes: [],
  pokemonDetail: {},
  
};

function rootReducer(state = initialState, action) {

  switch (action.type) {
  
  case GET_POKEMONS: 
    console.log('reducer get pokemons')
    return {
      ...state,
      pokemonsCount: action.payload.count,
      pokemonsLoaded: action.payload.pokemons
    };

  case GET_POKEMON_DETAIL:
    console.log('reducer get Detail')
    return {
      ...state,
      pokemonDetail: action.payload
    }

    case GET_POKEMONS_TYPES:
      console.log('reducer get Types')
    return {
      ...state,
      pokemonsTypes: action.payload
    }

    case ORDER_POKEMONS_BY_NAME:

    return {
      ...state,
      pokemonsLoaded: action.payload,
    }

    case FILTER_BY_PERSONALIZATION:
      return {
        ...state,
        isFilterByPersonalization: action.payload,
      }
    
      case FILTER_BY_TYPE:
        return {
          ...state,
          isFilterByType: action.payload,
        }

  default:
    return state;
  }
  
}

export default rootReducer;