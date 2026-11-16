export interface SsrFetchOptions {
  /** Cache TTL in seconds using Cloudflare Cache API when available. Set to 0 to bypass cache. */
  ttlSeconds?: number;
  /** Label used in SSR log messages (e.g. "home.astro"). */
  logTag?: string;
}

export interface SsrFetchResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  cached: boolean;
  errorMessage?: string;
}

interface CloudflareCacheStorage {
  default?: Cache;
}

const DEFAULT_USER_AGENT = 'PokeApp-SSR/1.0';

/**
 * Resolves the backend API base URL for SSR pages across Astro, Vite, and Node environments.
 */
export function resolveApiBase(): string {
  return (
    import.meta.env.PUBLIC_API_URL ||
    import.meta.env.API_URL ||
    (typeof process !== 'undefined' ? process.env.API_URL : undefined) ||
    'http://localhost:3002'
  );
}

function getEdgeCache(): Cache | undefined {
  const storage = (globalThis as unknown as { caches?: CloudflareCacheStorage }).caches;
  return storage?.default;
}

/**
 * Fetches JSON from an upstream API during SSR, using Cloudflare's Cache API when available
 * and logging diagnostic headers on non-OK responses (such as edge 429 rate limits).
 */
export async function fetchSsrJson<T>(
  url: string,
  options: SsrFetchOptions = {}
): Promise<SsrFetchResult<T>> {
  const { ttlSeconds = 0, logTag = 'SSR' } = options;
  const cache = ttlSeconds > 0 ? getEdgeCache() : undefined;
  const cacheKey = new Request(url, { method: 'GET' });

  if (cache) {
    try {
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        const data = (await cachedResponse.json()) as T;
        return { ok: true, status: cachedResponse.status, data, cached: true };
      }
    } catch (cacheErr) {
      console.warn(`[${logTag}] Cache read error for ${url}:`, cacheErr);
    }
  }

  console.log(`[${logTag}] Fetching from: ${url}`);

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': DEFAULT_USER_AGENT,
      },
    });

    if (!res.ok) {
      const retryAfter = res.headers.get('retry-after');
      const server = res.headers.get('server');
      const cfRay = res.headers.get('cf-ray');
      console.error(
        `[${logTag}] Failed to fetch ${url}. Status: ${res.status}`,
        JSON.stringify({ retryAfter, server, cfRay })
      );
      return {
        ok: false,
        status: res.status,
        data: null,
        cached: false,
        errorMessage: `HTTP ${res.status}`,
      };
    }

    const bodyText = await res.text();
    const data = JSON.parse(bodyText) as T;

    if (cache) {
      try {
        const cacheResponse = new Response(bodyText, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': `public, max-age=${ttlSeconds}`,
          },
        });
        await cache.put(cacheKey, cacheResponse);
      } catch (cacheErr) {
        console.warn(`[${logTag}] Cache write error for ${url}:`, cacheErr);
      }
    }

    return { ok: true, status: res.status, data, cached: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[${logTag}] Network/parse error fetching ${url}:`, err);
    return {
      ok: false,
      status: 0,
      data: null,
      cached: false,
      errorMessage: message,
    };
  }
}
