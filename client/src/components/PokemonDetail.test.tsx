import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PokemonDetail from './PokemonDetail';
import '@testing-library/jest-dom';

describe('<PokemonDetail />', () => {
  const mockPokemon = {
    id: 1,
    name: "Pikachu",
    life: 35,
    strength: 55,
    defense: 40,
    speed: 90,
    height: 4,
    weight: 60,
    types: [{ name: 'electric' }]
  };

  it('renders stats and name correctly from props', () => {
    render(<PokemonDetail pokemon={mockPokemon} />);
    
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText(/vida \/ hp/i)).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText(/fuerza/i)).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText(/defensa/i)).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
  });
});
