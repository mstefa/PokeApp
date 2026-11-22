import React, { useEffect, useState } from 'react';
import PokemonDetail, { type PokemonData } from './PokemonDetail';
import Styles from './Pokemons.module.css';
import { getApiBase } from '../lib/api';

interface PokemonDetailViewProps {
  id: string;
}

export default function PokemonDetailView({ id }: PokemonDetailViewProps) {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const apiBase = getApiBase();

    async function loadPokemon() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${apiBase}/pokemons/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          setError(`Pokemon no encontrado (status ${res.status})`);
          setPokemon(null);
          return;
        }

        const data = (await res.json()) as PokemonData;
        setPokemon(data);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError('Pokemon no encontrado');
        setPokemon(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPokemon();

    return () => {
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return (
      <div className={Styles.loadingImg} role="status" aria-live="polite">
        <img src="/resources/loading.gif" alt="Cargando Pokémon..." />
        <p className={Styles.loadingText}>Cargando Pokémon...</p>
      </div>
    );
  }

  if (pokemon) {
    return <PokemonDetail pokemon={pokemon} />;
  }

  return (
    <div className={Styles.errorContainer} role="alert">
      <h2>Error al cargar el Pokémon</h2>
      <p>{error}</p>
      <a href="/home" className={Styles.backBtn}>
        Volver a Home
      </a>
    </div>
  );
}
