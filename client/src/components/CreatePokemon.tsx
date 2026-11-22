import React, { useEffect, useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import Styles from './CreatePokemon.module.css';
import { getApiBase } from '../lib/api';

interface TypeData {
  id: number | string;
  name: string;
}

interface CreatePokemonProps {
  types?: TypeData[];
}

export default function CreatePokemon({ types: initialTypes }: CreatePokemonProps) {
  const [types, setTypes] = useState<TypeData[]>(initialTypes ?? []);
  const [typesError, setTypesError] = useState<string | null>(null);
  const [input, setInput] = useState({
    name: '',
    life: 0,
    strength: 0,
    defense: 0,
    speed: 0,
    height: 0,
    weight: 0,
    personalized: true,
    img: '',
    types: [] as { id: number | string; name: string }[],
  });

  useEffect(() => {
    if (initialTypes && initialTypes.length > 0) return;

    const controller = new AbortController();
    const apiBase = getApiBase();

    fetch(`${apiBase}/types`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTypes(data);
        }
      })
      .catch((err) => {
        if ((err as Error).name === 'AbortError') return;
        setTypesError(
          err instanceof Error && err.message.startsWith('status ')
            ? `Error al obtener tipos de Pokémon (${err.message})`
            : 'Error al obtener tipos de Pokémon'
        );
      });

    return () => {
      controller.abort();
    };
  }, [initialTypes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) || 0 : e.target.value;
    setInput({
      ...input,
      [e.target.name]: value,
    });
  };

  const handleChangeOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(e.target.selectedOptions, (option) => ({
      id: isNaN(Number(option.id)) ? option.id : Number(option.id),
      name: option.value,
    }));
    setInput({
      ...input,
      types: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const apiBase = getApiBase();

    if (input.name && input.name.trim().length > 0) {
      fetch(`${apiBase}/pokemons`, {
        method: 'POST',
        body: JSON.stringify({
          ...input,
          name: input.name.trim(),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          window.alert(data);
          if (typeof data === 'string' && data.toLowerCase().includes('creado')) {
            window.location.href = '/home';
          }
        })
        .catch((error) => console.error('Error:', error));
    } else {
      window.alert('Revisa los datos. El nombre es obligatorio.');
    }
  };

  return (
    <>
      {typesError && (
        <div
          role="alert"
          style={{
            backgroundColor: '#ffdddd',
            color: '#ff0000',
            padding: '1rem',
            borderRadius: '0.25rem',
            marginBottom: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          <span>{typesError}</span>
        </div>
      )}
      <Card className={Styles.container}>
      <form className={Styles.formContainer} onSubmit={handleSubmit}>
        <div className={Styles.section}>
          <h2 className={Styles.sectionTitle}>Identidad del Pokémon</h2>
          
          <div className={Styles.field}>
            <label className={Styles.label} htmlFor="name">
              ¿Cuál es el nombre de tu Pokémon? *
            </label>
            <Input
              id="name"
              className={Styles.input}
              type="text"
              name="name"
              required
              placeholder="Ej: Fuegozard"
              onChange={handleInputChange}
              value={input.name}
            />
          </div>

          <div className={Styles.field}>
            <label className={Styles.label} htmlFor="img">
              ¿Tienes una URL de su imagen?
            </label>
            <Input
              id="img"
              className={Styles.input}
              type="text"
              name="img"
              placeholder="https://example.com/pokemon.png"
              onChange={handleInputChange}
              value={input.img || ''}
            />
          </div>
        </div>

        <div className={Styles.divider}></div>

        <div className={Styles.section}>
          <h2 className={Styles.sectionTitle}>Estadísticas de Combate</h2>
          <div className={Styles.statGrid}>
            <div className={Styles.field}>
              <label className={Styles.label} htmlFor="life">Puntos de Vida / HP</label>
              <Input
                id="life"
                className={Styles.input}
                type="number"
                min="1"
                max="150"
                step="1"
                name="life"
                onChange={handleInputChange}
                value={input.life}
              />
            </div>
            
            <div className={Styles.field}>
              <label className={Styles.label} htmlFor="strength">Fuerza</label>
              <Input
                id="strength"
                className={Styles.input}
                type="number"
                min="1"
                max="150"
                step="1"
                name="strength"
                onChange={handleInputChange}
                value={input.strength}
              />
            </div>

            <div className={Styles.field}>
              <label className={Styles.label} htmlFor="defense">Defensa</label>
              <Input
                id="defense"
                className={Styles.input}
                type="number"
                min="1"
                max="150"
                step="1"
                name="defense"
                onChange={handleInputChange}
                value={input.defense}
              />
            </div>

            <div className={Styles.field}>
              <label className={Styles.label} htmlFor="speed">Velocidad</label>
              <Input
                id="speed"
                className={Styles.input}
                type="number"
                min="1"
                max="150"
                step="1"
                name="speed"
                onChange={handleInputChange}
                value={input.speed}
              />
            </div>

            <div className={Styles.field}>
              <label className={Styles.label} htmlFor="height">Altura (dm)</label>
              <Input
                id="height"
                className={Styles.input}
                type="number"
                min="1"
                max="150"
                step="1"
                name="height"
                onChange={handleInputChange}
                value={input.height}
              />
            </div>

            <div className={Styles.field}>
              <label className={Styles.label} htmlFor="weight">Peso (hg)</label>
              <Input
                id="weight"
                className={Styles.input}
                type="number"
                min="1"
                max="150"
                step="1"
                name="weight"
                onChange={handleInputChange}
                value={input.weight}
              />
            </div>
          </div>
        </div>

        <div className={Styles.divider}></div>

        <div className={Styles.section}>
          <h2 className={Styles.sectionTitle}>Afinidad Elemental</h2>
          <div className={Styles.field}>
            <label className={Styles.label} htmlFor="type">
              ¿Qué tipo es tu Pokémon? <span className={Styles.subLabel}>(puedes elegir más de uno con Ctrl/Cmd)</span>
            </label>
            <select
              className={Styles.inputSelect}
              id="type"
              name="type"
              size={5}
              multiple
              onChange={handleChangeOptions}
            >
              {types.map((e) => {
                return (
                  <option key={e.id} id={e.id.toString()} value={e.name}>
                    {e.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className={Styles.submitWrapper}>
          <Button variant="primary" className={Styles.buttonSubmit} type="submit">
            ¡Crear Pokémon!
          </Button>
        </div>
      </form>
    </Card>
    </>
  );
}
