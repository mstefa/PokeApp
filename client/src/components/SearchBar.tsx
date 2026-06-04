import React, { useState } from 'react';
import Styles from './SearchBar.module.css';

interface TypeData {
  id: number | string;
  name: string;
}

interface SearchBarProps {
  types: TypeData[];
  currentType: string;
  currentSort: string;
  currentPersonalized: boolean;
  currentSearch: string;
}

export default function SearchBar({
  types,
  currentType,
  currentSort,
  currentPersonalized,
  currentSearch,
}: SearchBarProps) {
  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateUrl = (newParams: Record<string, string | boolean | null>) => {
    const params = new URLSearchParams(window.location.search);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all' || value === false) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    // Reset page to 1 when changing filters/sort
    params.set('page', '1');

    window.location.href = `?${params.toString()}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const apiBase = import.meta.env.PUBLIC_API_URL || 'http://localhost:3002';

    fetch(`${apiBase}/pokemons/search?name=${searchInput.toLowerCase().trim()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((id) => {
        window.location.href = `/pokemon/${id}`;
      })
      .catch(() => {
        window.alert(`No se encontró el Pokemon: ${searchInput}`);
      });
  };

  return (
    <div className={Styles.container}>
      <form className={Styles.formContainer} onSubmit={handleSearchSubmit}>
        <div>
          <input
            className={Styles.input}
            placeholder="Pikachu"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className={Styles.buttonSearch} type="submit">
            <img
              className={Styles.img}
              src="/resources/buscar.png"
              alt="Search"
              width="15"
            />
          </button>
        </div>
      </form>
      <div className={Styles.filters}>
        <button
          className={`${Styles.buttonFilter} ${currentSort === 'asc' ? Styles.active : ''}`}
          onClick={() => updateUrl({ sort: 'asc' })}
        >
          a-z
        </button>
        <button
          className={`${Styles.buttonFilter} ${currentSort === 'desc' ? Styles.active : ''}`}
          onClick={() => updateUrl({ sort: 'desc' })}
        >
          z-a
        </button>
        <button
          className={`${Styles.buttonFilter} ${currentPersonalized ? Styles.active : ''}`}
          onClick={() => updateUrl({ personalized: !currentPersonalized })}
        >
          {currentPersonalized ? 'todos' : 'solo nuestros'}
        </button>
      </div>
      <div className={Styles.sort}>
        <span className={Styles.sortText}>Tipo: </span>
        <select
          className={Styles.input}
          value={currentType}
          onChange={(e) => updateUrl({ type: e.target.value })}
        >
          <option value="all">todos</option>
          {types.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
