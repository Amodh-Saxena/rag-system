import { useState, useCallback } from 'react';
import { queryMemory } from '../lib/api';
import type { QueryState } from '../lib/types';

export function useQuery() {
  const [state, setState] = useState<QueryState>({ status: 'idle' });

  const execute = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setState({ status: 'loading', stage: 'Initializing memory trace...' });

    try {
      const result = await queryMemory(query, (stage) => {
        setState({ status: 'loading', stage });
      });
      setState({ status: 'complete', result });
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  return { state, execute, reset };
}
