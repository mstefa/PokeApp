import React, { useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import Styles from './Pokemons.module.css';
import { getApiBase } from '../lib/api';

interface TypeData {
  id: number | string;
  name: string;
}

interface PokemonSummary {
  id: string | number;
  name: string;
  img?: string | null;
  types?: Array<{ name: string }> | null;
  personalized?: boolean;
}

export interface PokemonHomeProps {
  page: number;
  type: string;
  sort: string;
  personalized: boolean;
  search: string;
  currentSearch: string;
}

const LIMIT = 12;

export default function PokemonHome({
  page,
  type,
  sort,
  personalized,
  search,
  currentSearch,
}: PokemonHomeProps) {
  const [types, setTypes] = useState<TypeData[]>([]);
  const [pokemons, setPokemons] = useState<PokemonSummary[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const apiBase = getApiBase();

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [typesRes, pokemonsRes] = await Promise.all([
          fetch(`${apiBase}/types`, { signal: controller.signal }),
          fetch(`${apiBase}/pokemons?limit=1000`, { signal: controller.signal }),
        ]);

        if (typesRes.ok) {
          const typesData = await typesRes.json();
          if (Array.isArray(typesData)) {
            setTypes(typesData);
          }
        }

        if (!pokemonsRes.ok) {
          setError(`Error al obtener los pokémons (status ${pokemonsRes.status})`);
          setPokemons([]);
          setCount(0);
          return;
        }

        const pokemonsData = await pokemonsRes.json();
        let allPokemons: PokemonSummary[] = Array.isArray(pokemonsData?.pokemons)
          ? [...pokemonsData.pokemons]
          : [];

        if (personalized) {
          allPokemons = allPokemons.filter((p) => p.personalized);
        }

        if (type !== 'all') {
          allPokemons = allPokemons.filter(
            (p) => p.types && p.types.some((t) => t.name === type)
          );
        }

        if (sort === 'name-asc') {
          allPokemons.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'name-desc') {
          allPokemons.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sort === 'desc') {
          allPokemons.sort((a, b) => Number(b.id) - Number(a.id));
        } else {
          allPokemons.sort((a, b) => Number(a.id) - Number(b.id));
        }

        const offset = (page - 1) * LIMIT;
        setCount(allPokemons.length);
        setPokemons(allPokemons.slice(offset, offset + LIMIT));
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError('Error al obtener los pokémons');
        setPokemons([]);
        setCount(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [page, type, sort, personalized]);

  return (
    <>
      {error && (
        <div className={Styles.errorBanner} role="alert">
          <span>{error}</span>
        </div>
      )}

      <SearchBar
        types={types}
        currentType={type}
        currentSort={sort}
        currentPersonalized={personalized}
        currentSearch={search}
      />

      {loading ? (
        <div className={Styles.loadingImg} role="status" aria-live="polite">
          <img src="/resources/loading.gif" alt="Cargando Pokémon..." />
          <p className={Styles.loadingText}>Cargando Pokémon...</p>
        </div>
      ) : pokemons.length > 0 ? (
        <>
          <div className={Styles.container}>
            {pokemons.map((p) => (
              <PokemonCard
                key={p.id}
                id={p.id}
                name={p.name}
                img={p.img}
                types={p.types}
                personalized={p.personalized}
              />
            ))}
          </div>

          <div className={Styles.pagination}>
            <Pagination
              total={count}
              currentPage={page}
              limit={LIMIT}
              currentSearch={currentSearch}
            />
          </div>
        </>
      ) : (
        <div className={Styles.noResults}>
          <p>No se encontraron Pokémon con los filtros seleccionados.</p>
        </div>
      )}
    </>
  );
}
