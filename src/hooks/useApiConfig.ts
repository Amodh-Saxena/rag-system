import { useState, useEffect, useCallback } from 'react';
import { apiStore, probeBackend } from '../lib/apiStore';
import type { ApiConfig, ApiMode } from '../lib/apiStore';

export function useApiConfig() {
  const [config, setConfig] = useState<ApiConfig>(apiStore.get());
  const [probing, setProbing] = useState(false);

  useEffect(() => {
    return apiStore.subscribe(() => setConfig(apiStore.get()));
  }, []);

  const setMode = useCallback((mode: ApiMode) => {
    apiStore.set({ mode });
  }, []);

  const setUrl = useCallback((url: string) => {
    apiStore.set({ url });
  }, []);

  const setRepositoryId = useCallback((repositoryId: string) => {
    apiStore.set({ repositoryId });
  }, []);

  const probe = useCallback(async (url?: string) => {
    setProbing(true);
    const ok = await probeBackend(url ?? config.url);
    setProbing(false);
    return ok;
  }, [config.url]);

  return { config, setMode, setUrl, setRepositoryId, probe, probing };
}
