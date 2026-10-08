import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '../hooks/useQuery';
import { MemoryTrace } from '../components/MemoryTrace';
import { NodePanel } from '../components/NodePanel';
import { useApiConfig } from '../hooks/useApiConfig';
import { EXAMPLE_QUERIES } from '../lib/mockData';
import type { Citation } from '../lib/types';

const MEMORY_TYPE_COLORS = {
  episodic: { label: 'text-[#A84A32]', bg: 'bg-[#A84A32]/10 border-[#A84A32]/30' },
  semantic: { label: 'text-[#4F6854]', bg: 'bg-[#4F6854]/10 border-[#4F6854]/30' },
  temporal: { label: 'text-[#2D6A73]', bg: 'bg-[#2D6A73]/10 border-[#2D6A73]/30' },
};

function InlineCitation({ citation, onClick }: { citation: Citation; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="font-code text-xs text-[#A84A32] hover:underline cursor-pointer mx-0.5 align-super leading-none"
      title={`${citation.type} — ${citation.label}`}
      aria-label={`Open citation: ${citation.label}`}
    >
      [{citation.id.slice(0, 7)}]
    </button>
  );
}

function AnswerText({ text, citations, onCitationClick }: {
  text: string;
  citations: Citation[];
  onCitationClick: (nodeId: string) => void;
}) {
  // Replace [citationId] markers with interactive citation buttons
  const citationMap = new Map(citations.map((c) => [c.id, c]));
  const parts = text.split(/(\[[a-zA-Z0-9_\-]+\])/g);

  return (
    <>
      {parts.map((part, i) => {
        const inner = part.match(/^\[([a-zA-Z0-9_\-]+)\]$/)?.[1];
        if (inner) {
          const citation = citationMap.get(inner);
          if (citation) {
            return (
              <InlineCitation
                key={i}
                citation={citation}
                onClick={() => onCitationClick(citation.nodeId)}
              />
            );
          }
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function QueryView() {
  const [inputValue, setInputValue] = useState('');
  const [showTrace, setShowTrace] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { state, execute } = useQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { config } = useApiConfig();
  const isMock = config.mode === 'mock';

  const handleSubmit = useCallback(
    (query: string) => {
      if (!query.trim()) return;
      setShowTrace(false);
      execute(query).then(() => setShowTrace(true));
    },
    [execute],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || true)) {
      handleSubmit(inputValue);
    }
  };

  const handleExampleClick = (q: string) => {
    setInputValue(q);
    handleSubmit(q);
  };

  const handleCitationClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const isLoading = state.status === 'loading';
  const isComplete = state.status === 'complete';
  const isError = state.status === 'error';

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 pt-10 pb-20">
          {/* Mock badge */}
          {isMock && (
            <div className="mb-5 inline-flex items-center gap-2 px-2.5 py-1 border border-border-color text-xs font-code text-muted-color">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A84A32] inline-block" />
              LOCAL MOCK MEMORY
            </div>
          )}

          {/* Command bar */}
          <div
            className={`border transition-colors duration-150 ${
              isLoading
                ? 'border-[#2D6A73]/60 bg-[#2D6A73]/5'
                : 'border-border-color hover:border-text-color/30 bg-bg-color'
            } flex items-center gap-3 px-4 py-3`}
          >
            <span className="text-muted-color text-lg leading-none shrink-0">⌕</span>
            <input
              ref={inputRef}
              id="query-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the repository... (e.g. Why was ChromaDB replaced?)"
              className="bg-transparent border-none outline-none flex-1 font-body text-sm text-text-color placeholder:text-muted-color/50"
              aria-label="Repository memory query"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSubmit(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              className="text-xs font-code text-muted-color bg-black/5 dark:bg-white/5 px-2 py-1 shrink-0 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-40 transition-colors"
              aria-label="Submit query"
            >
              ↵ Enter
            </button>
          </div>

          {/* Retrieval source toggles */}
          <div className="flex gap-6 mt-3 px-1 text-xs font-code">
            {(['Semantic', 'Episodic', 'Temporal'] as const).map((type) => {
              const key = type.toLowerCase() as 'semantic' | 'episodic' | 'temporal';
              const colors = MEMORY_TYPE_COLORS[key];
              return (
                <div key={type} className="flex items-center gap-1.5">
                  <span className={`${colors.label}`}>✓</span>
                  <span className={`${colors.label}`}>{type}</span>
                </div>
              );
            })}
          </div>

          {/* Loading state */}
          {isLoading && state.status === 'loading' && (
            <div className="mt-10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2D6A73] animate-pulse" />
                <span className="text-sm font-code text-muted-color">{state.stage}</span>
              </div>
              <div className="h-px bg-border-color" />
              <div className="text-xs font-code text-muted-color/50 pl-4 space-y-1.5">
                {[
                  'Reading semantic memory...',
                  'Tracing episodic history...',
                  'Checking temporal state...',
                  'Resolving evidence...',
                  'Synthesizing answer...',
                ].map((s) => (
                  <div
                    key={s}
                    className={`transition-opacity duration-300 ${
                      s === state.stage ? 'opacity-100 text-text-color' : 'opacity-30'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {isError && state.status === 'error' && (
            <div className="mt-10 border border-[#A84A32]/30 bg-[#A84A32]/5 px-5 py-4">
              <div className="text-xs font-code text-[#A84A32] uppercase tracking-widest mb-1">
                Retrieval Interrupted
              </div>
              <div className="text-sm text-text-color">{state.message}</div>
              <button
                onClick={() => handleSubmit(inputValue)}
                className="mt-3 text-xs font-code text-[#A84A32] hover:underline"
              >
                RETRY QUERY
              </button>
            </div>
          )}

          {/* Result */}
          {isComplete && state.status === 'complete' && (
            <div className="mt-10">
              {/* Query echo */}
              <h2 className="font-display text-xl text-text-color mb-6 leading-tight">
                {state.result.query}
              </h2>

              {/* Answer */}
              <div className="font-body text-base leading-relaxed space-y-4 text-text-color">
                {state.result.answer.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>
                    <AnswerText
                      text={para}
                      citations={state.result.citations}
                      onCitationClick={handleCitationClick}
                    />
                  </p>
                ))}
              </div>

              {/* Provenance strip */}
              <div className="mt-8 border-t border-border-color pt-6">
                <div className="text-xs font-code text-muted-color mb-4 uppercase tracking-widest">
                  Evidence
                </div>
                <div className="flex flex-col gap-4">
                  {state.result.provenance.map((prov) => {
                    const colors = MEMORY_TYPE_COLORS[prov.type];
                    return (
                      <div key={prov.type} className="flex items-start gap-4">
                        <div className={`w-20 shrink-0 text-xs font-code ${colors.label} uppercase`}>
                          {prov.type}
                        </div>
                        <div>
                          <div className="text-xs font-code text-muted-color">{prov.label}</div>
                          <div className="mt-1.5 flex flex-col gap-1">
                            {prov.items.slice(0, 3).map((item) => (
                              <button
                                key={item.id}
                                onClick={() => handleCitationClick(item.id)}
                                className="text-left text-xs font-code text-text-color hover:text-[#A84A32] transition-colors"
                                aria-label={`Open node: ${item.label}`}
                              >
                                {item.label}
                                {item.detail && (
                                  <span className="text-muted-color ml-2">— {item.detail}</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Confidence */}
                <div className="mt-6 flex items-center justify-between text-xs font-code text-muted-color">
                  <span>CONFIDENCE</span>
                  <span>{state.result.confidence.toFixed(2)}</span>
                </div>
                <div className="mt-1 h-0.5 bg-border-color">
                  <div
                    className="h-full bg-[#4F6854] transition-all duration-700"
                    style={{ width: `${state.result.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* Memory Trace */}
              <div className="mt-8 border-t border-border-color pt-6">
                <MemoryTrace steps={state.result.trace} visible={showTrace} />
              </div>

              {/* Explore graph link */}
              <div className="mt-8">
                <button
                  onClick={() => navigate('/graph')}
                  className="text-xs font-code text-muted-color hover:text-text-color transition-colors underline underline-offset-2"
                >
                  Explore in Memory Graph →
                </button>
              </div>
            </div>
          )}

          {/* Empty / initial state */}
          {state.status === 'idle' && (
            <div className="mt-12">
              <div className="text-xs font-code text-muted-color uppercase tracking-widest mb-4">
                Example Queries
              </div>
              <div className="flex flex-col gap-2">
                {EXAMPLE_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleExampleClick(q)}
                    className="text-left text-sm text-text-color hover:text-[#A84A32] transition-colors font-body py-1 border-b border-border-color/50 last:border-0"
                    aria-label={`Ask: ${q}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Node detail panel */}
      <NodePanel
        nodeId={selectedNodeId}
        onClose={() => setSelectedNodeId(null)}
      />
    </div>
  );
}
