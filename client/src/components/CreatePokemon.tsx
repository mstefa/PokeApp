import React, { useState } from 'react';
import Styles from './CreatePokemon.module.css';

interface TypeData {
  id: number | string;
  name: string;
}

interface CreatePokemonProps {
  types: TypeData[];
}

export default function CreatePokemon({ types }: CreatePokemonProps) {
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
    const apiBase = import.meta.env.PUBLIC_API_URL || 'http://localhost:3002';

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
    <div className={Styles.container}>
      <form className={Styles.formContainer} onSubmit={handleSubmit}>
        <div>
          <p>
            <strong>Cual es el nombre de tu pokemon?</strong>
          </p>
          <input
            className={Styles.input}
            type="text"
            name="name"
            required
            onChange={handleInputChange}
            value={input.name}
          />
          <p>
            <strong>Tienes una imagen de él?</strong>
          </p>
          <input
            className={Styles.input}
            type="text"
            name="img"
            onChange={handleInputChange}
            value={input.img || ''}
          />
        </div>
        <div className={Styles.stat}>
          <p>
            <strong>Cuales son sus principales puntos fuertes?</strong>
          </p>
          <div>
            <label>vida / hp:</label>
            <input
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
          <div>
            <label>fuerza:</label>
            <input
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
          <div>
            <label>defensa:</label>
            <input
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
          <div>
            <label>velocidad:</label>
            <input
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
          <div>
            <label>altura:</label>
            <input
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
          <div>
            <label>peso:</label>
            <input
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
        <div className={Styles.stat}>
          <label htmlFor="type">
            <strong>Que tipo es tu pokemon? </strong>(puedes elegir mas de uno!)
          </label>
          <select
            className={Styles.inputSelect}
            id="type"
            name="type"
            size={4}
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
          <input className={Styles.buttonSumit} type="submit" value="Crear Pokémon" />
        </div>
      </form>
    </div>
  );
}
