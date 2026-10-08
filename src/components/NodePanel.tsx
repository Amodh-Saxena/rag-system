import React, { useEffect, useState } from 'react';
import { X, FileText, GitCommit, Cpu, Database, Lightbulb, Box } from 'lucide-react';
import type { NodeDetail, NodeType } from '../lib/types';
import { getNodeDetail } from '../lib/api';

interface NodePanelProps {
  nodeId: string | null;
  onClose: () => void;
}

const NODE_TYPE_ICONS: Record<NodeType, React.ReactNode> = {
  file: <FileText size={14} />,
  function: <Box size={14} />,
  class: <Box size={14} />,
  commit: <GitCommit size={14} />,
  agent: <Cpu size={14} />,
  database: <Database size={14} />,
  concept: <Lightbulb size={14} />,
  repository: <FileText size={14} />,
  folder: <FileText size={14} />,
  api: <Box size={14} />,
  dependency: <Box size={14} />,
};

const NODE_TYPE_COLORS: Record<NodeType, string> = {
  file: 'text-[#4F6854]',
  function: 'text-[#2D6A73]',
  class: 'text-[#2D6A73]',
  commit: 'text-[#A84A32]',
  agent: 'text-[#2D6A73]',
  database: 'text-[#667078]',
  concept: 'text-[#4F6854]',
  repository: 'text-[#667078]',
  folder: 'text-[#667078]',
  api: 'text-[#2D6A73]',
  dependency: 'text-[#667078]',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-code text-muted-color uppercase tracking-widest mb-2">{title}</div>
      {children}
    </div>
  );
}

function Tag({ children, color = '' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className={`inline-block font-code text-xs px-1.5 py-0.5 border border-border-color rounded-sm mr-1 mb-1 ${color || 'text-muted-color'}`}>
      {children}
    </span>
  );
}

export function NodePanel({ nodeId, onClose }: NodePanelProps) {
  const [detail, setDetail] = useState<NodeDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!nodeId) return;
    setLoading(true);
    setDetail(null);
    getNodeDetail(nodeId).then((d) => {
      setDetail(d);
      setLoading(false);
    });
  }, [nodeId]);

  if (!nodeId) return null;

  return (
    <aside className="w-80 border-l border-border-color bg-bg-color flex flex-col overflow-hidden shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-color">
        <span className="text-xs font-code text-muted-color uppercase tracking-widest">Node Detail</span>
        <button
          onClick={onClose}
          className="text-muted-color hover:text-text-color transition-colors p-1 rounded"
          aria-label="Close node panel"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {loading && (
          <div className="text-xs font-code text-muted-color animate-pulse">Loading node...</div>
        )}

        {!loading && !detail && nodeId && (
          <div className="text-xs font-code text-muted-color">
            Node <span className="text-text-color">{nodeId}</span> not found in local memory.
          </div>
        )}

        {detail && (
          <>
            {/* Identity */}
            <div className="mb-6">
              <div className={`flex items-center gap-2 mb-1 ${NODE_TYPE_COLORS[detail.type]}`}>
                {NODE_TYPE_ICONS[detail.type]}
                <span className="text-xs font-code uppercase tracking-wide">{detail.type}</span>
              </div>
              <h2 className="font-code text-base text-text-color break-all">{detail.label}</h2>
              {detail.path && (
                <div className="text-xs font-code text-muted-color mt-1 break-all">{detail.path}</div>
              )}
            </div>

            {/* Description */}
            {detail.description && (
              <Section title="Description">
                <p className="text-sm text-text-color leading-relaxed">{detail.description}</p>
              </Section>
            )}

            {/* Commit-specific */}
            {detail.hash && (
              <Section title="Commit">
                <div className="font-code text-sm text-text-color">{detail.hash}</div>
                {detail.author && <div className="text-xs text-muted-color mt-1">by {detail.author}</div>}
                {detail.timestamp && (
                  <div className="text-xs font-code text-muted-color mt-0.5">
                    {new Date(detail.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </Section>
            )}

            {/* Language */}
            {detail.language && (
              <Section title="Language">
                <Tag>{detail.language}</Tag>
              </Section>
            )}

            {/* Functions */}
            {detail.functions && detail.functions.length > 0 && (
              <Section title="Functions">
                <div>
                  {detail.functions.map((fn) => (
                    <Tag key={fn} color="text-[#2D6A73]">{fn}</Tag>
                  ))}
                </div>
              </Section>
            )}

            {/* Classes */}
            {detail.classes && detail.classes.length > 0 && (
              <Section title="Classes">
                <div>
                  {detail.classes.map((cls) => (
                    <Tag key={cls} color="text-[#4F6854]">{cls}</Tag>
                  ))}
                </div>
              </Section>
            )}

            {/* Depends On */}
            {detail.dependsOn && detail.dependsOn.length > 0 && (
              <Section title="Depends On">
                <div className="flex flex-col gap-1">
                  {detail.dependsOn.map((dep) => (
                    <div key={dep} className="text-xs font-code text-muted-color flex items-center gap-1">
                      <span className="text-border-color">├─</span>
                      <span>{dep}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Dependents */}
            {detail.dependents && detail.dependents.length > 0 && (
              <Section title="Used By">
                <div className="flex flex-col gap-1">
                  {detail.dependents.map((dep) => (
                    <div key={dep} className="text-xs font-code text-muted-color flex items-center gap-1">
                      <span className="text-border-color">←</span>
                      <span>{dep}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Files Changed (commits) */}
            {detail.filesChanged && detail.filesChanged.length > 0 && (
              <Section title="Files Changed">
                <div className="flex flex-col gap-1">
                  {detail.filesChanged.map((f) => (
                    <div key={f} className="text-xs font-code text-muted-color">{f}</div>
                  ))}
                </div>
              </Section>
            )}

            {/* History */}
            {detail.recentChanges && detail.recentChanges.length > 0 && (
              <Section title="History">
                <div className="flex flex-col gap-3">
                  {detail.recentChanges.map((ch, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-xs font-code text-muted-color shrink-0 w-12">{ch.date}</span>
                      <div>
                        <div className="text-xs text-text-color">{ch.description}</div>
                        {ch.commit && (
                          <div className="text-xs font-code text-[#A84A32]">{ch.commit}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Decisions */}
            {detail.relatedDecisions && detail.relatedDecisions.length > 0 && (
              <Section title="Why">
                <div className="flex flex-col gap-1.5">
                  {detail.relatedDecisions.map((d, i) => (
                    <div key={i} className="text-xs text-text-color leading-relaxed border-l-2 border-[#A84A32]/40 pl-3">
                      {d}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Evidence */}
            {detail.evidence && detail.evidence.length > 0 && (
              <Section title="Evidence">
                <div className="flex flex-col gap-1">
                  {detail.evidence.map((ev, i) => (
                    <div key={i} className="text-xs font-code text-[#A84A32]">{ev}</div>
                  ))}
                </div>
              </Section>
            )}

            {/* Confidence */}
            {detail.confidence !== undefined && (
              <div className="mt-4 pt-4 border-t border-border-color">
                <div className="flex items-center justify-between text-xs font-code">
                  <span className="text-muted-color">CONFIDENCE</span>
                  <span className="text-text-color">{detail.confidence.toFixed(2)}</span>
                </div>
                <div className="mt-1.5 h-1 bg-border-color rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4F6854] rounded-full transition-all duration-500"
                    style={{ width: `${detail.confidence * 100}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
