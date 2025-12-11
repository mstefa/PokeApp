// Utility type for async results
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const Ok = <T>(value: T): Result<T> => ({
  ok: true,
  value,
});

export const Err = <E extends Error>(error: E): Result<never, E> => ({
  ok: false,
  error,
});

// Logger utility
export const logger = {
  info: (message: string, data?: unknown): void => {
    console.log(`[INFO] ${message}`, data ?? '');
  },
  error: (message: string, error?: unknown): void => {
    console.error(`[ERROR] ${message}`, error ?? '');
  },
  warn: (message: string, data?: unknown): void => {
    console.warn(`[WARN] ${message}`, data ?? '');
  },
  debug: (message: string, data?: unknown): void => {
    if (process.env.DEBUG === 'true') {
      console.log(`[DEBUG] ${message}`, data ?? '');
    }
  },
};
