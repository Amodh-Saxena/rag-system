import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

interface PaletteCommand {
  id: string;
  label: string;
  detail?: string;
  category: string;
  action: () => void;
}

export function CommandPalette({ open, onClose, onToggleTheme, onOpenSettings }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const commands: PaletteCommand[] = [
    { id: 'query', label: 'Ask about repository', detail: 'Open query view', category: 'Navigate', action: () => { navigate('/'); onClose(); } },
    { id: 'graph', label: 'Open Memory Graph', detail: 'Explore semantic structure', category: 'Navigate', action: () => { navigate('/graph'); onClose(); } },
    { id: 'timeline', label: 'Open Timeline', detail: 'Explore repository history', category: 'Navigate', action: () => { navigate('/timeline'); onClose(); } },
    { id: 'theme', label: 'Toggle light / dark mode', detail: 'Switch color scheme', category: 'Action', action: () => { onToggleTheme(); onClose(); } },
    { id: 'api-settings', label: 'API Settings', detail: 'Configure backend URL and mode', category: 'Action', action: () => { onOpenSettings(); } },
    { id: 'arch', label: 'Show architecture', detail: 'Graph — filter to structural nodes', category: 'View', action: () => { navigate('/graph'); onClose(); } },
    { id: 'stale', label: 'Find stale memories', detail: 'Show nodes not verified recently', category: 'View', action: () => { navigate('/graph'); onClose(); } },
    { id: 'recent', label: 'Show recent changes', detail: 'Timeline — latest events', category: 'View', action: () => { navigate('/timeline'); onClose(); } },
    { id: 'ingest', label: 'Ingest repository', detail: 'Index a codebase into memory', category: 'Action', action: () => { navigate('/'); onClose(); } },
  ];

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.detail?.toLowerCase().includes(query.toLowerCase()),
      )
    : commands;

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === 'Enter' && filtered[selected]) {
        filtered[selected].action();
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [filtered, selected, onClose],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/30 dark:bg-black/50" />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg mx-4 bg-bg-color border border-border-color shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-color">
          <span className="text-muted-color font-code text-sm">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search memory..."
            className="flex-1 bg-transparent border-none outline-none font-body text-sm text-text-color placeholder:text-muted-color/50"
            aria-label="Command palette search"
          />
          <button onClick={onClose} className="text-muted-color hover:text-text-color transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Commands */}
        <div className="max-h-80 overflow-y-auto py-1" role="listbox">
          {filtered.length === 0 && (
            <div className="px-4 py-3 text-xs font-code text-muted-color">No commands found.</div>
          )}
          {filtered.map((cmd, idx) => (
            <button
              key={cmd.id}
              role="option"
              aria-selected={idx === selected}
              onClick={cmd.action}
              onMouseEnter={() => setSelected(idx)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-4 transition-colors ${
                idx === selected
                  ? 'bg-color-ink/5 dark:bg-white/5'
                  : 'hover:bg-color-ink/3 dark:hover:bg-white/3'
              }`}
            >
              <span className="text-xs font-code text-muted-color w-16 shrink-0">{cmd.category}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-text-color">{cmd.label}</div>
                {cmd.detail && (
                  <div className="text-xs text-muted-color">{cmd.detail}</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border-color px-4 py-2 flex gap-4 text-xs font-code text-muted-color">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
