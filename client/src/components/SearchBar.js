import React from 'react'
import Styles from './SearchBar.module.css';
import { useHistory } from "react-router"
import { useDispatch, useSelector } from 'react-redux'
import { filterByPersonalization, filterByType, sortPokemons } from '../actions';
import search from '../resurces/buscar.png'

let baseURL= process.env.REACT_APP_API;
baseURL = baseURL || 'http://localhost:3002';

export default function SearchBar() {

  const pokemons = useSelector(state => state.pokemonsLoaded);
  const types = useSelector(state => state.pokemonsTypes);
  const isFilterByPersonalization = useSelector(state => state.isFilterByPersonalization);
  const dispatch = useDispatch();

  const [input, setInput] = React.useState('');
  const handleInputChange = function(e) {
    setInput(
      e.target.value
    );
  }
  let history = useHistory()

  const handleSubmit = e => {
    e.preventDefault()
    
    fetch(`${baseURL}/pokemons/search?name=${input}`)
      .then(response => response.json())
      .then(id => {
        history.push(`/pokemon/${id}`)
      })
  }

  return (
    <div className={Styles.container}>
      <form className={Styles.formContainer} onSubmit={(e) => handleSubmit(e)}>
          <div>
            <input
              className={Styles.input}
              placeholder='Pikachu'
              type="text"
              // value={title}
              onChange={(e) => handleInputChange(e)}
            />
            <button className={Styles.buttonSearch} type="submit"><img className={Styles.img} src = {search} alt = 'Search' width='15' /></button>
          </div>
        </form>
        <div className={Styles.filters}>
          <button className={Styles.buttonFilter} onClick ={()=>dispatch(sortPokemons(pokemons, 'asc'))}>a-z</button>
          <button className={Styles.buttonFilter} onClick ={()=>dispatch(sortPokemons(pokemons, 'desc'))}>z-a</button>
          <button className={Styles.buttonFilter} value='filter' onClick={()=>
              dispatch(filterByPersonalization(!isFilterByPersonalization ))
            }>solo nuestros
          </button>
        </div>
        <div className={Styles.sort}>
          <span className={Styles.sortText}>Tipo: </span>
          <select  
            className={Styles.input} 
            onChange={(e)=>
                dispatch(filterByType(e.target.value))
              }>
                <option id = {99999} value = {'all'}>todos</option>
              {types.map((e) =>{
                return (<option id = {e.id} value = {e.name}>{e.name}</option>)
              })}
          </select>
        </div>
      
    </div>
  )
}
