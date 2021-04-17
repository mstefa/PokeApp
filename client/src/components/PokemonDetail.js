import React from 'react'
import{ useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getPokemonsDetail } from '../actions';
import Styles from './PokemonDetail.module.css';
import loading from '../resurces/loading.gif'

export default function PokemonDetail(props) {

  const pokemon = useSelector(state => state.pokemonDetail)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPokemonsDetail(props.match.params.id))
  }, [props, dispatch ])

  if(!!pokemon.name){
    return (
      <div className={Styles.container}>
        <div>
          <img className={Styles.img} src = {pokemon.img} alt = 'Pokemon' />
        </div>
        <p className={Styles.name}>{pokemon.name}</p>
        <p className={Styles.number}> # {pokemon.id}</p>
        {pokemon.types && pokemon.types.map((t)=>
          <span className={Styles.type}>{t.name}</span>
        )}
        <p className={Styles.title}> Estadisticas</p>
        <div className={Styles.stat}>
          <div className={Styles.dataPresentation}>
            <label className={Styles.text}>vida / hp: {pokemon.life}</label>
            <label className={Styles.text}>fuerza: {pokemon.strength}</label>
            <label className={Styles.text}>defensa: {pokemon.defense}</label>
          </div>
          <div className={Styles.dataPresentation}>
            <label className={Styles.text}>velocidad: {pokemon.speed}</label>
            <label className={Styles.text}>altura:{pokemon.height} </label>
            <label className={Styles.text}>peso: {pokemon.weight}</label>
          </div>
        </div>
    </div>
    )
  }else{
    return(
      <div className={Styles.loadingImg}>
        <img className={Styles.img} src = {loading} alt = 'Loading' />
        Loading... 
      </div>
    )
  }

}
