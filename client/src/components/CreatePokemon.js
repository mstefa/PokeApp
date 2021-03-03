import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTypes } from '../actions';
import Styles from './CreatePokemon.module.css';

export default function CreatePokemon() {
  const dispatch = useDispatch();
  const [input, setInput] = React.useState({
    name: '',
    life: 0, 
    strength: 0,
    defense: 0,
    speed: 0,
    height: 0,
    weight: 0,
    personalized: true,
    img: null,
    types: [],
  });

  const types = useSelector(state => state.pokemonsTypes)
  
  const handleInputChange = function(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  }

  const handleChangeOptions = (e) => {
    let value = Array.from(e.target.selectedOptions, option => {return {id: option.id, name: option.value}});
    setInput({
      ...input,
      types: value
    });
  }

  const handleSubmit = e => {
    e.preventDefault()
    if(input.name && input.name.length>0){
      fetch(`http://localhost:3002/pokemons`, {
        method: 'POST', 
        body: JSON.stringify(input), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        window.alert(data)
      })
      .catch(error => console.error('Error:', error));
    }else{
      window.alert('Revisa los datos' )
    }
  }

  React.useEffect(() => {
    if(types.length < 1){
      dispatch(getTypes())
    }
  }, [])

  return (
    <div className={Styles.container}>
      <form 
      className={Styles.formContainer} 
      onSubmit={handleSubmit}>
        <div>
          <p><strong>Cual es el nombre de tu pokemon?</strong></p>
          <input
            className={Styles.input} 
            type='text' name='name' 
            onChange={handleInputChange} value={input.name}>
          </input>
          <p><strong>Tienes una imagen de él?</strong></p>
          <input
            className={Styles.input} 
            type='img' name='img'
            onChange={handleInputChange} value={input.img}>
          </input>
        </div>
        <div className={Styles.stat}>
          <p><strong>Cuales son sus principales puntos fuertes?</strong></p>
          <div>
            <label>vida / hp:</label>
            <input 
              className={Styles.input}
              type="number"  min="1" max="50" step="1" name='life' 
              onChange={handleInputChange} value={input.life}>
            </input>
          </div>
          <div>
            <label>fuerza:</label>
            <input 
              className={Styles.input}
              type="number"  min="1" max="50" step="1" name='strength' 
              onChange={handleInputChange} value={input.strength}>
            </input>
          </div>
          <div>
            <label>defensa:</label>
            <input 
              className={Styles.input}
              type="number"  min="1" max="50" step="1" name='defense' 
              onChange={handleInputChange} value={input.defense}>
            </input>
          </div>
          <div>
            <label>velocidad:</label>
            <input 
              className={Styles.input}
              type="number"  min="1" max="50" step="1" name='speed' 
              onChange={handleInputChange} value={input.speed}>
            </input>
          </div>
          <div>
            <label>altura:</label>
            <input 
              className={Styles.input}
              type="number"  min="1" max="50" step="1" name='height' 
              onChange={handleInputChange} value={input.height}>
            </input>
          </div>
          <div>
            <label>peso:</label>
            <input 
              className={Styles.input}
              type="number"  min="1" max="50" step="1" name='weight' 
              onChange={handleInputChange} value={input.weight}>
            </input>
          </div>
        </div>
        <div className={Styles.stat}>
        <label for="type"><strong>Que tipo es tu pokemon? </strong>(puedes elegir mas de uno!)</label>
          <select 
          className={Styles.inputSelect}
          id="type" name="type" size="4" multiple onChange={handleChangeOptions}>
            {types.map((e) =>{
              return (<option id = {e.id} value = {e.name}>{e.name}</option>)
            })}
          </select>
        <input 
          className={Styles.buttonSumit}
          type='submit'/>
        </div>
      </form>
    </div>
  )
}
