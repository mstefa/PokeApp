import React from 'react';
import Styles from './PokemonDetail.module.css';

export interface PokemonType {
  id?: number;
  name: string;
}

export interface PokemonData {
  id: string | number;
  name: string;
  life: number;
  strength: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  img?: string | null;
  types?: PokemonType[] | null;
  personalized?: boolean;
}

interface PokemonDetailProps {
  pokemon: PokemonData;
}

export default function PokemonDetail({ pokemon }: PokemonDetailProps) {
  return (
    <div className={Styles.container}>
      <div>
        <img
          className={Styles.img}
          src={pokemon.img || '/resources/pokeball.png'}
          alt={pokemon.name}
        />
      </div>
      <p className={Styles.name}>{pokemon.name}</p>
      <p className={Styles.number}> # {pokemon.id}</p>
      {pokemon.types &&
        pokemon.types.map((t, idx) => (
          <span key={idx} className={Styles.type}>
            {t.name}
          </span>
        ))}
      <p className={Styles.title}> Estadisticas</p>
      <div className={Styles.stat}>
        <div className={Styles.dataPresentation}>
          <label className={Styles.text}>vida / hp: {pokemon.life}</label>
          <label className={Styles.text}>fuerza: {pokemon.strength}</label>
          <label className={Styles.text}>defensa: {pokemon.defense}</label>
        </div>
        <div className={Styles.dataPresentation}>
          <label className={Styles.text}>velocidad: {pokemon.speed}</label>
          <label className={Styles.text}>altura: {pokemon.height}</label>
          <label className={Styles.text}>peso: {pokemon.weight}</label>
        </div>
      </div>
    </div>
  );
}
