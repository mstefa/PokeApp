import React from 'react';
import Card from './ui/Card';
import TypeBadge from './ui/TypeBadge';
import Styles from './PokemonCard.module.css';

interface PokemonCardProps {
  id: string | number;
  name: string;
  img?: string | null;
  types?: Array<{ name: string }> | null;
  personalized?: boolean;
}

export default function PokemonCard({ id, name, img, types }: PokemonCardProps) {
  return (
    <Card interactive className={Styles.container}>
      <a href={`/pokemon/${id}`} className={Styles.link}>
        <div className={Styles.imageWrapper}>
          <img
            className={Styles.img}
            src={img || '/resources/pokeball.png'}
            alt={name}
          />
        </div>
        <p className={Styles.name}>{name}</p>
        <p className={Styles.number}>#{id}</p>
        <div className={Styles.typesContainer}>
          {types &&
            types.map((t, idx) => (
              <TypeBadge key={idx} typeName={t.name} />
            ))}
        </div>
      </a>
    </Card>
  );
}
