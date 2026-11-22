import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import PokemonHome from './PokemonHome';
import '@testing-library/jest-dom/vitest';

describe('<PokemonHome />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state and then renders fetched pokemons and types', async () => {
    const fetchMock = vi.fn().mockImplementation((input: string) => {
      if (input.endsWith('/types')) {
        return Promise.resolve(
          new Response(JSON.stringify([{ id: 1, name: 'electric' }, { id: 2, name: 'fire' }]), {
            status: 200,
          })
        );
      }
      return Promise.resolve(
        new Response(
          JSON.stringify({
            pokemons: [
              { id: 25, name: 'pikachu', types: [{ name: 'electric' }], personalized: false },
              { id: 4, name: 'charmander', types: [{ name: 'fire' }], personalized: false },
            ],
          }),
          { status: 200 }
        )
      );
    });
    global.fetch = fetchMock;

    render(
      <PokemonHome
        page={1}
        type="all"
        sort="asc"
        personalized={false}
        search=""
        currentSearch=""
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent(/cargando pokémon/i);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
      expect(screen.getByText('charmander')).toBeInTheDocument();
    });
  });

  it('filters by type and displays empty state when no pokemon matches', async () => {
    global.fetch = vi.fn().mockImplementation((input: string) => {
      if (input.endsWith('/types')) {
        return Promise.resolve(new Response(JSON.stringify([{ id: 1, name: 'water' }]), { status: 200 }));
      }
      return Promise.resolve(
        new Response(
          JSON.stringify({
            pokemons: [{ id: 25, name: 'pikachu', types: [{ name: 'electric' }], personalized: false }],
          }),
          { status: 200 }
        )
      );
    });

    render(
      <PokemonHome
        page={1}
        type="water"
        sort="asc"
        personalized={false}
        search=""
        currentSearch="?type=water"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/no se encontraron pokémon/i)).toBeInTheDocument();
    });
  });

  it('displays an error alert when fetching pokemons fails', async () => {
    global.fetch = vi.fn().mockImplementation((input: string) => {
      if (input.endsWith('/types')) {
        return Promise.resolve(new Response(JSON.stringify([]), { status: 200 }));
      }
      return Promise.resolve(new Response('Server error', { status: 500 }));
    });

    render(
      <PokemonHome
        page={1}
        type="all"
        sort="asc"
        personalized={false}
        search=""
        currentSearch=""
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/status 500/i);
    });
  });
});
