import React, { useState } from 'react';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
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
  const isFilterActive = currentType !== 'all' || currentPersonalized;

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
        <div className={Styles.searchWrapper}>
          <Input
            className={Styles.searchInput}
            placeholder="Pikachu..."
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button variant="accent" className={Styles.buttonSearch} type="submit">
            <img
              className={Styles.img}
              src="/resources/buscar.png"
              alt="Search"
              width="16"
              height="16"
            />
          </Button>
        </div>
      </form>
      <div className={Styles.filters}>
        <Button
          variant={currentSort === 'asc' || !['desc', 'name-asc', 'name-desc'].includes(currentSort) ? 'primary' : 'secondary'}
          className={Styles.buttonFilter}
          onClick={() => updateUrl({ sort: 'asc' })}
        >
          # ↑
        </Button>
        <Button
          variant={currentSort === 'desc' ? 'primary' : 'secondary'}
          className={Styles.buttonFilter}
          onClick={() => updateUrl({ sort: 'desc' })}
        >
          # ↓
        </Button>
        <Button
          variant={currentSort === 'name-asc' ? 'primary' : 'secondary'}
          className={Styles.buttonFilter}
          onClick={() => updateUrl({ sort: 'name-asc' })}
        >
          a-z
        </Button>
        <Button
          variant={currentSort === 'name-desc' ? 'primary' : 'secondary'}
          className={Styles.buttonFilter}
          onClick={() => updateUrl({ sort: 'name-desc' })}
        >
          z-a
        </Button>
        <Button
          variant={currentPersonalized ? 'primary' : 'secondary'}
          className={Styles.buttonFilter}
          onClick={() => updateUrl({ personalized: !currentPersonalized })}
        >
          {currentPersonalized ? 'todos' : 'solo creados'}
        </Button>
        {isFilterActive && (
          <Button
            variant="accent"
            className={Styles.buttonClear}
            onClick={() => updateUrl({ type: 'all', personalized: false })}
          >
            Limpiar Filtros
          </Button>
        )}
      </div>
      <div className={Styles.sort}>
        <span className={Styles.sortText}>Tipo:</span>
        <Select
          className={Styles.selectInput}
          value={currentType}
          onChange={(e) => updateUrl({ type: e.target.value })}
        >
          <option value="all">todos</option>
          {types.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
