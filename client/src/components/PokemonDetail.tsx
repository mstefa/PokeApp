import React from 'react';
import Card from './ui/Card';
import TypeBadge from './ui/TypeBadge';
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
    <Card className={Styles.container}>
      <div className={Styles.header}>
        <div className={Styles.imageWrapper}>
          <img
            className={Styles.img}
            src={pokemon.img || '/resources/pokeball.png'}
            alt={pokemon.name}
          />
        </div>
        <div className={Styles.titleSection}>
          <p className={Styles.number}>#{pokemon.id}</p>
          <h1 className={Styles.name}>{pokemon.name}</h1>
          <div className={Styles.typesContainer}>
            {pokemon.types &&
              pokemon.types.map((t, idx) => (
                <TypeBadge key={idx} typeName={t.name} />
              ))}
          </div>
        </div>
      </div>
      
      <div className={Styles.divider}></div>

      <div className={Styles.statsSection}>
        <h2 className={Styles.title}>Estadísticas</h2>
        <div className={Styles.statGrid}>
          <div className={Styles.statItem}>
            <span className={Styles.statLabel}>Vida / HP</span>
            <div className={Styles.statBarContainer}>
              <div className={Styles.statBar} style={{ width: `${Math.min(100, (pokemon.life / 150) * 100)}%`, backgroundColor: 'var(--color-grass)' }}></div>
            </div>
            <span className={Styles.statValue}>{pokemon.life}</span>
          </div>

          <div className={Styles.statItem}>
            <span className={Styles.statLabel}>Fuerza</span>
            <div className={Styles.statBarContainer}>
              <div className={Styles.statBar} style={{ width: `${Math.min(100, (pokemon.strength / 150) * 100)}%`, backgroundColor: 'var(--poke-red)' }}></div>
            </div>
            <span className={Styles.statValue}>{pokemon.strength}</span>
          </div>

          <div className={Styles.statItem}>
            <span className={Styles.statLabel}>Defensa</span>
            <div className={Styles.statBarContainer}>
              <div className={Styles.statBar} style={{ width: `${Math.min(100, (pokemon.defense / 150) * 100)}%`, backgroundColor: 'var(--poke-blue)' }}></div>
            </div>
            <span className={Styles.statValue}>{pokemon.defense}</span>
          </div>

          <div className={Styles.statItem}>
            <span className={Styles.statLabel}>Velocidad</span>
            <div className={Styles.statBarContainer}>
              <div className={Styles.statBar} style={{ width: `${Math.min(100, (pokemon.speed / 150) * 100)}%`, backgroundColor: 'var(--poke-yellow)' }}></div>
            </div>
            <span className={Styles.statValue}>{pokemon.speed}</span>
          </div>
        </div>
      </div>

      <div className={Styles.divider}></div>

      <div className={Styles.dimensionsSection}>
        <div className={Styles.dimensionItem}>
          <span className={Styles.dimLabel}>Altura</span>
          <span className={Styles.dimValue}>{pokemon.height / 10} m</span>
        </div>
        <div className={Styles.dimensionItem}>
          <span className={Styles.dimLabel}>Peso</span>
          <span className={Styles.dimValue}>{pokemon.weight / 10} kg</span>
        </div>
      </div>
    </Card>
  );
}
