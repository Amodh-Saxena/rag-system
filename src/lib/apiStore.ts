/**
 * API Connection Store
 * -------------------
 * Manages the runtime API configuration — URL, mode (mock/live), and
 * connection health. Persisted to localStorage so settings survive refreshes.
 *
 * Components read from this store rather than directly from env vars,
 * so the user can switch modes at runtime without restarting the dev server.
 */

export type ApiMode = 'mock' | 'live';

export interface ApiConfig {
  mode: ApiMode;
  url: string;
  repositoryId: string;
  lastHealthCheck: 'ok' | 'error' | 'unknown';
}

const STORAGE_KEY = 'nm-api-config';

const DEFAULT_CONFIG: ApiConfig = {
  mode: 'live',
  url: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  repositoryId: 'nexus-research',
  lastHealthCheck: 'unknown',
};

function load(): ApiConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ApiConfig>;
      return { ...DEFAULT_CONFIG, ...parsed, mode: 'live' };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_CONFIG };
}

function save(config: ApiConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

let _config: ApiConfig = load();
const _listeners = new Set<() => void>();

export const apiStore = {
  get(): ApiConfig {
    return { ..._config };
  },

  set(patch: Partial<ApiConfig>) {
    _config = { ..._config, ...patch };
    save(_config);
    _listeners.forEach((fn) => fn());
  },

  subscribe(fn: () => void): () => void {
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  },

  isLive(): boolean {
    return _config.mode === 'live';
  },

  isMock(): boolean {
    return _config.mode === 'mock';
  },
};

/** Health-check the configured backend URL. Updates store with result. */
export async function probeBackend(url?: string): Promise<boolean> {
  const target = url ?? _config.url;
  try {
    const res = await fetch(`${target}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    const ok = res.ok;
    apiStore.set({ lastHealthCheck: ok ? 'ok' : 'error' });
    return ok;
  } catch {
    apiStore.set({ lastHealthCheck: 'error' });
    return false;
  }
}
