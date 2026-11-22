import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import PokemonDetailView from './PokemonDetailView';
import '@testing-library/jest-dom/vitest';

describe('<PokemonDetailView />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and renders pokemon detail', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 25,
          name: 'Pikachu',
          life: 35,
          strength: 55,
          defense: 40,
          speed: 90,
          height: 4,
          weight: 60,
          types: [{ name: 'electric' }],
        }),
        { status: 200 }
      )
    );

    render(<PokemonDetailView id="25" />);

    expect(screen.getByRole('status')).toHaveTextContent(/cargando pokémon/i);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Pikachu' })).toBeInTheDocument();
    });
  });

  it('renders error alert and home link when pokemon is not found', async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response('Not found', { status: 404 }));

    render(<PokemonDetailView id="9999" />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/status 404/i);
      expect(screen.getByRole('link', { name: /volver a home/i })).toHaveAttribute('href', '/home');
    });
  });
});
