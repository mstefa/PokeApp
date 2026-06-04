import React from 'react';
import Styles from './Pokemon.module.css';

interface PokemonProps {
  id: string | number;
  name: string;
  img?: string | null;
  types?: Array<{ name: string }> | null;
  personalized?: boolean;
}

export default function Pokemon({ id, name, img, types }: PokemonProps) {
  return (
    <div className={Styles.container}>
      <a href={`/pokemon/${id}`}>
        <div>
          <img
            className={Styles.img}
            src={img || '/resources/pokeball.png'}
            alt={name}
          />
        </div>
        <p className={Styles.name}>{name}</p>
        <p className={Styles.number}> # {id}</p>
        {types &&
          types.map((t, idx) => (
            <span key={idx} className={Styles.type}>
              {t.name}
            </span>
          ))}
      </a>
    </div>
  );
}
