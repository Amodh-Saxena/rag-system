import { useState, useEffect, useRef } from 'react';
import { X, Wifi, WifiOff, Radio, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useApiConfig } from '../hooks/useApiConfig';

interface ApiSettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const PRESET_URLS = [
  { label: 'localhost:8000', value: 'http://localhost:8000' },
  { label: 'localhost:8080', value: 'http://localhost:8080' },
  { label: 'localhost:3000', value: 'http://localhost:3000' },
];

const ENDPOINT_TESTS = [
  { label: 'Health', method: 'GET', path: '/health', desc: 'Backend liveness check' },
  { label: 'Query', method: 'POST', path: '/query', desc: 'Memory query endpoint' },
  { label: 'Graph', method: 'GET', path: '/graph/{repoId}', desc: 'Knowledge graph endpoint' },
  { label: 'Timeline', method: 'GET', path: '/timeline/{repoId}', desc: 'Timeline events endpoint' },
  { label: 'Ingest', method: 'POST', path: '/ingest', desc: 'Repository ingestion endpoint' },
];

type TestResult = 'idle' | 'loading' | 'ok' | 'error';

export function ApiSettingsPanel({ open, onClose }: ApiSettingsPanelProps) {
  const { config, setMode, setUrl, setRepositoryId, probe, probing } = useApiConfig();
  const [urlDraft, setUrlDraft] = useState(config.url);
  const [repoDraft, setRepoDraft] = useState(config.repositoryId);
  const [endpointResults, setEndpointResults] = useState<Record<string, TestResult>>({});
  const [testQuery, setTestQuery] = useState('Why was ChromaDB replaced with Qdrant?');
  const [testQueryResult, setTestQueryResult] = useState<string | null>(null);
  const [testQueryLoading, setTestQueryLoading] = useState(false);
  const [testQueryError, setTestQueryError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlDraft(config.url);
    setRepoDraft(config.repositoryId);
  }, [config.url, config.repositoryId]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const handleApplyUrl = () => {
    setUrl(urlDraft.trim());
    setRepositoryId(repoDraft.trim());
  };

  const handleProbe = async () => {
    setUrl(urlDraft.trim());
    await probe(urlDraft.trim());
  };

  const handleTestEndpoint = async (endpoint: (typeof ENDPOINT_TESTS)[number]) => {
    const key = endpoint.path;
    setEndpointResults((r) => ({ ...r, [key]: 'loading' }));
    try {
      const url = `${urlDraft.trim()}${endpoint.path.replace('{repoId}', repoDraft.trim())}`;
      const res = await fetch(url, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: endpoint.method === 'POST' ? JSON.stringify({}) : undefined,
        signal: AbortSignal.timeout(5000),
      });
      setEndpointResults((r) => ({ ...r, [key]: res.ok || res.status < 500 ? 'ok' : 'error' }));
    } catch {
      setEndpointResults((r) => ({ ...r, [key]: 'error' }));
    }
  };

  const handleTestAllEndpoints = async () => {
    for (const ep of ENDPOINT_TESTS) {
      handleTestEndpoint(ep);
    }
  };

  const handleTestQuery = async () => {
    setTestQueryLoading(true);
    setTestQueryResult(null);
    setTestQueryError(null);
    try {
      const res = await fetch(`${urlDraft.trim()}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery, repository_id: repoDraft.trim() }),
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => res.statusText);
        setTestQueryError(`${res.status}: ${txt}`);
      } else {
        const data = await res.json();
        setTestQueryResult(
          typeof data.answer === 'string'
            ? data.answer
            : JSON.stringify(data, null, 2),
        );
      }
    } catch (err) {
      setTestQueryError(String(err));
    } finally {
      setTestQueryLoading(false);
    }
  };

  const healthColor =
    config.lastHealthCheck === 'ok'
      ? 'text-[#4F6854]'
      : config.lastHealthCheck === 'error'
        ? 'text-[#A84A32]'
        : 'text-muted-color';

  const healthIcon =
    config.lastHealthCheck === 'ok' ? (
      <CheckCircle size={12} className="text-[#4F6854]" />
    ) : config.lastHealthCheck === 'error' ? (
      <AlertCircle size={12} className="text-[#A84A32]" />
    ) : (
      <Radio size={12} className="text-muted-color" />
    );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/20 dark:bg-black/40" />

      {/* Panel */}
      <div
        className="relative h-full w-full max-w-md bg-bg-color border-l border-border-color flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-color shrink-0">
          <div>
            <div className="text-xs font-code text-muted-color uppercase tracking-widest mb-0.5">
              API Configuration
            </div>
            <div className="text-sm font-body text-text-color">Memory Core Settings</div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-color hover:text-text-color transition-colors p-1"
            aria-label="Close settings"
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-8">

          {/* Mode toggle */}
          <section>
            <div className="text-xs font-code text-muted-color uppercase tracking-widest mb-3">
              Data Source
            </div>
            <div className="flex border border-border-color">
              <button
                onClick={() => setMode('mock')}
                className={`flex-1 py-2.5 text-xs font-code transition-colors flex items-center justify-center gap-2 ${
                  config.mode === 'mock'
                    ? 'bg-[#A84A32]/10 text-[#A84A32] border-r border-[#A84A32]/30'
                    : 'text-muted-color hover:text-text-color border-r border-border-color'
                }`}
                aria-pressed={config.mode === 'mock'}
              >
                <WifiOff size={12} />
                LOCAL MOCK
              </button>
              <button
                onClick={() => setMode('live')}
                className={`flex-1 py-2.5 text-xs font-code transition-colors flex items-center justify-center gap-2 ${
                  config.mode === 'live'
                    ? 'bg-[#4F6854]/10 text-[#4F6854]'
                    : 'text-muted-color hover:text-text-color'
                }`}
                aria-pressed={config.mode === 'live'}
              >
                <Wifi size={12} />
                LIVE API
              </button>
            </div>

            {config.mode === 'mock' && (
              <p className="mt-2 text-xs text-muted-color leading-relaxed">
                Using built-in nexus-research mock data. No backend required.
              </p>
            )}
            {config.mode === 'live' && (
              <p className="mt-2 text-xs text-muted-color leading-relaxed">
                All queries will hit the real FastAPI backend. Mock data is not used.
              </p>
            )}
          </section>

          {/* Backend URL */}
          <section>
            <div className="text-xs font-code text-muted-color uppercase tracking-widest mb-3">
              Backend URL
            </div>

            {/* Presets */}
            <div className="flex gap-2 mb-2 flex-wrap">
              {PRESET_URLS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setUrlDraft(p.value)}
                  className={`text-xs font-code px-2 py-1 border transition-colors ${
                    urlDraft === p.value
                      ? 'border-[#2D6A73] text-[#2D6A73]'
                      : 'border-border-color text-muted-color hover:text-text-color'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom URL input */}
            <div className="flex items-center gap-2 border border-border-color px-3 py-2">
              <input
                ref={inputRef}
                type="url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleProbe()}
                placeholder="http://localhost:8000"
                className="flex-1 bg-transparent border-none outline-none text-xs font-code text-text-color placeholder:text-muted-color/50"
                aria-label="Backend URL"
              />
              {/* Health indicator */}
              <div className={`flex items-center gap-1 ${healthColor}`}>
                {healthIcon}
              </div>
            </div>

            {/* Repository ID */}
            <div className="mt-2 flex items-center gap-2 border border-border-color px-3 py-2">
              <span className="text-xs font-code text-muted-color shrink-0">repo:</span>
              <input
                type="text"
                value={repoDraft}
                onChange={(e) => setRepoDraft(e.target.value)}
                placeholder="nexus-research"
                className="flex-1 bg-transparent border-none outline-none text-xs font-code text-text-color placeholder:text-muted-color/50"
                aria-label="Repository ID"
              />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={handleApplyUrl}
                className="text-xs font-code px-3 py-1.5 border border-border-color text-muted-color hover:text-text-color transition-colors"
              >
                Apply
              </button>
              <button
                onClick={handleProbe}
                disabled={probing}
                className="text-xs font-code px-3 py-1.5 border border-border-color text-[#2D6A73] hover:bg-[#2D6A73]/5 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                aria-label="Test backend connection"
              >
                <RefreshCw size={10} className={probing ? 'animate-spin' : ''} />
                {probing ? 'Probing...' : 'Test Connection'}
              </button>
            </div>

            {config.lastHealthCheck !== 'unknown' && (
              <div
                className={`mt-2 text-xs font-code ${
                  config.lastHealthCheck === 'ok' ? 'text-[#4F6854]' : 'text-[#A84A32]'
                }`}
              >
                {config.lastHealthCheck === 'ok'
                  ? '✓ Backend reachable'
                  : '✗ Backend unreachable — check URL and ensure the FastAPI server is running'}
              </div>
            )}
          </section>

          {/* Endpoint tests */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-code text-muted-color uppercase tracking-widest">
                Endpoint Tests
              </div>
              <button
                onClick={handleTestAllEndpoints}
                className="text-xs font-code text-muted-color hover:text-text-color transition-colors underline underline-offset-2"
              >
                Test all
              </button>
            </div>
            <div className="flex flex-col divide-y divide-border-color border border-border-color">
              {ENDPOINT_TESTS.map((ep) => {
                const result = endpointResults[ep.path] ?? 'idle';
                return (
                  <div
                    key={ep.path}
                    className="flex items-center gap-3 px-3 py-2.5"
                  >
                    {/* Status icon */}
                    <div className="shrink-0 w-4">
                      {result === 'loading' && (
                        <RefreshCw size={10} className="text-[#2D6A73] animate-spin" />
                      )}
                      {result === 'ok' && (
                        <CheckCircle size={10} className="text-[#4F6854]" />
                      )}
                      {result === 'error' && (
                        <AlertCircle size={10} className="text-[#A84A32]" />
                      )}
                      {result === 'idle' && (
                        <div className="w-2 h-2 rounded-full border border-border-color" />
                      )}
                    </div>

                    {/* Endpoint info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-code text-[#2D6A73]">{ep.method}</span>
                        <span className="text-xs font-code text-text-color">{ep.path}</span>
                      </div>
                      <div className="text-xs text-muted-color">{ep.desc}</div>
                    </div>

                    <button
                      onClick={() => handleTestEndpoint(ep)}
                      className="shrink-0 text-xs font-code text-muted-color hover:text-text-color transition-colors"
                    >
                      Test
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Live query test */}
          <section>
            <div className="text-xs font-code text-muted-color uppercase tracking-widest mb-3">
              Trial Query
            </div>
            <p className="text-xs text-muted-color mb-3">
              Send a real query to the backend and inspect the raw response.
            </p>

            <textarea
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              rows={2}
              className="w-full bg-bg-color border border-border-color px-3 py-2 text-xs font-code text-text-color resize-none outline-none focus:border-[#2D6A73] transition-colors"
              placeholder="Enter a test query..."
              aria-label="Test query"
            />

            <button
              onClick={handleTestQuery}
              disabled={testQueryLoading || !testQuery.trim()}
              className="mt-2 w-full py-2 text-xs font-code border border-[#2D6A73] text-[#2D6A73] hover:bg-[#2D6A73]/8 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {testQueryLoading ? (
                <>
                  <RefreshCw size={10} className="animate-spin" />
                  Querying backend...
                </>
              ) : (
                'Send Trial Query →'
              )}
            </button>

            {testQueryError && (
              <div className="mt-3 border border-[#A84A32]/30 bg-[#A84A32]/5 px-3 py-2">
                <div className="text-xs font-code text-[#A84A32] uppercase tracking-widest mb-1">
                  Query Error
                </div>
                <pre className="text-xs text-text-color whitespace-pre-wrap font-code">
                  {testQueryError}
                </pre>
              </div>
            )}

            {testQueryResult && (
              <div className="mt-3 border border-[#4F6854]/30 bg-[#4F6854]/5 px-3 py-3">
                <div className="text-xs font-code text-[#4F6854] uppercase tracking-widest mb-2">
                  Response
                </div>
                <p className="text-xs text-text-color leading-relaxed font-body">
                  {testQueryResult.length > 600
                    ? testQueryResult.slice(0, 600) + '…'
                    : testQueryResult}
                </p>
              </div>
            )}
          </section>

          {/* Connection guide */}
          <section>
            <div className="text-xs font-code text-muted-color uppercase tracking-widest mb-3">
              Connection Guide
            </div>
            <div className="text-xs text-muted-color leading-relaxed space-y-2 font-code border border-border-color px-4 py-3">
              <div className="text-text-color mb-2">Start your FastAPI backend:</div>
              <div className="text-[#4F6854]">$ uvicorn main:app --reload --port 8000</div>
              <div className="text-text-color mt-3 mb-1">Or set env var before running Vite:</div>
              <div className="text-[#2D6A73]">VITE_API_URL=http://localhost:8000 npm run dev</div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-border-color px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-code">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                config.mode === 'live' ? 'bg-[#4F6854]' : 'bg-[#A84A32]'
              }`}
            />
            <span className="text-muted-color">
              {config.mode === 'live' ? `LIVE — ${config.url}` : 'LOCAL MOCK MEMORY'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-code text-muted-color hover:text-text-color transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
