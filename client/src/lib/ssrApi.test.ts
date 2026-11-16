import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchSsrJson } from './ssrApi';

describe('fetchSsrJson', () => {
  const originalFetch = globalThis.fetch;
  const originalCaches = (globalThis as { caches?: unknown }).caches;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (originalCaches === undefined) {
      delete (globalThis as { caches?: unknown }).caches;
    } else {
      (globalThis as { caches?: unknown }).caches = originalCaches;
    }
  });

  it('returns cached JSON on cache hit without calling fetch', async () => {
    const matchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ name: 'fire' }]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    const putMock = vi.fn();
    (globalThis as { caches?: unknown }).caches = {
      default: { match: matchMock, put: putMock },
    };

    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock;

    const result = await fetchSsrJson<Array<{ name: string }>>(
      'https://api.example.com/types',
      { ttlSeconds: 3600, logTag: 'test' }
    );

    expect(result).toEqual({
      ok: true,
      status: 200,
      data: [{ name: 'fire' }],
      cached: true,
    });
    expect(matchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(putMock).not.toHaveBeenCalled();
  });

  it('fetches with User-Agent and caches 200 OK responses with max-age TTL', async () => {
    const matchMock = vi.fn().mockResolvedValue(undefined);
    const putMock = vi.fn().mockResolvedValue(undefined);
    (globalThis as { caches?: unknown }).caches = {
      default: { match: matchMock, put: putMock },
    };

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ pokemons: [{ id: 1, name: 'bulbasaur' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    globalThis.fetch = fetchMock;

    const result = await fetchSsrJson<{ pokemons: Array<{ id: number; name: string }> }>(
      'https://api.example.com/pokemons?limit=1000',
      { ttlSeconds: 300, logTag: 'test' }
    );

    expect(result).toEqual({
      ok: true,
      status: 200,
      data: { pokemons: [{ id: 1, name: 'bulbasaur' }] },
      cached: false,
    });

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/pokemons?limit=1000', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'PokeApp-SSR/1.0',
      },
    });
    expect(putMock).toHaveBeenCalledTimes(1);
    const [, cachedResponse] = putMock.mock.calls[0] as [Request, Response];
    expect(cachedResponse.headers.get('Cache-Control')).toBe('public, max-age=300');
  });

  it('does not cache 429 responses and logs diagnostic headers', async () => {
    const matchMock = vi.fn().mockResolvedValue(undefined);
    const putMock = vi.fn();
    (globalThis as { caches?: unknown }).caches = {
      default: { match: matchMock, put: putMock },
    };

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('Too Many Requests', {
        status: 429,
        headers: {
          'retry-after': '30',
          server: 'cloudflare',
          'cf-ray': 'abc123-EZE',
        },
      })
    );
    globalThis.fetch = fetchMock;

    const result = await fetchSsrJson('https://api.example.com/types', {
      ttlSeconds: 3600,
      logTag: 'SSR home.astro',
    });

    expect(result).toEqual({
      ok: false,
      status: 429,
      data: null,
      cached: false,
      errorMessage: 'HTTP 429',
    });
    expect(putMock).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(
      '[SSR home.astro] Failed to fetch https://api.example.com/types. Status: 429',
      JSON.stringify({ retryAfter: '30', server: 'cloudflare', cfRay: 'abc123-EZE' })
    );
  });

  it('works gracefully when Cloudflare caches.default is unavailable', async () => {
    delete (globalThis as { caches?: unknown }).caches;

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ name: 'water' }]), { status: 200 })
    );
    globalThis.fetch = fetchMock;

    const result = await fetchSsrJson<Array<{ name: string }>>(
      'https://api.example.com/types',
      { ttlSeconds: 3600, logTag: 'test' }
    );

    expect(result).toEqual({
      ok: true,
      status: 200,
      data: [{ name: 'water' }],
      cached: false,
    });
  });
});
