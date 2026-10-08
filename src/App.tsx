import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { QueryView } from './views/QueryView';
import { GraphView } from './views/GraphView';
import { TimelineView } from './views/TimelineView';
import { Register } from './views/Register';
import { Login } from './views/Login';
import { CommandPalette } from './components/CommandPalette';
import { ApiSettingsPanel } from './components/ApiSettingsPanel';
import { useTheme } from './hooks/useTheme';
import { useApiConfig } from './hooks/useApiConfig';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { config } = useApiConfig();

  const isLive = config.mode === 'live';

  // Cmd/Ctrl+K opens command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      // Cmd/Ctrl+, opens settings
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setSettingsOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const navLink = (path: string, label: string) => {
    const active = location.pathname === path;
    return (
      <Link
        to={path}
        className={`text-sm transition-colors duration-150 ${
          active
            ? 'text-text-color font-medium border-l-2 border-[#A84A32] pl-3 -ml-[18px]'
            : 'text-muted-color hover:text-text-color'
        }`}
        aria-current={active ? 'page' : undefined}
      >
        {label}
      </Link>
    );
  };

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={
        <>
          <div className="flex h-screen w-full font-body overflow-hidden">

        {/* Left Instrument Rail */}
        <aside className="w-56 border-r border-border-color bg-bg-color flex flex-col py-6 pl-6 shrink-0">
          {/* Identity */}
          <div className="mb-8 pr-4">
            <h1 className="font-display font-semibold text-base tracking-tight text-text-color">
              NeuroMemory
            </h1>
            <div className="text-[10px] font-code text-muted-color mt-1.5 leading-relaxed">
              <div>repo: <span className="text-text-color">{config.repositoryId}</span></div>
              <div>branch: <span className="text-text-color">main</span></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-4">
            {/* Navigation */}
            <div className="text-[10px] font-code text-muted-color mb-3 tracking-widest uppercase">
              Memory
            </div>
            <nav className="flex flex-col gap-3 mb-8 pl-[18px]" aria-label="Main navigation">
              {navLink('/', 'Query')}
              {navLink('/graph', 'Graph')}
              {navLink('/timeline', 'Timeline')}
            </nav>

            {/* Memory Types */}
            <div className="text-[10px] font-code text-muted-color mb-3 tracking-widest uppercase">
              Memory Types
            </div>
            <div className="flex flex-col gap-2.5 mb-8 pl-[18px] text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A84A32]" aria-hidden="true" />
                <span className="text-muted-color">Episodic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4F6854]" aria-hidden="true" />
                <span className="text-muted-color">Semantic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2D6A73]" aria-hidden="true" />
                <span className="text-muted-color">Temporal</span>
              </div>
            </div>

            {/* Agents */}
            <div className="text-[10px] font-code text-muted-color mb-3 tracking-widest uppercase">
              Agents
            </div>
            <div className="flex flex-col gap-2 mb-8 pl-[18px] font-code text-xs">
              {[
                { id: 'research-agent',   label: 'ResearchAgent',   desc: 'Orchestrator' },
                { id: 'literature-agent', label: 'LiteratureAgent', desc: 'Retrieval' },
                { id: 'hypothesis-agent', label: 'HypothesisAgent', desc: 'Reasoning' },
                { id: 'reviewer-agent',   label: 'ReviewerAgent',   desc: 'QA loop' },
              ].map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => navigate('/graph')}
                  className="text-left flex items-start gap-2 group"
                  title={`Focus graph on ${agent.label}`}
                >
                  <span className="w-1 h-1 rounded-full bg-[#2D6A73] mt-1.5 shrink-0" />
                  <div>
                    <div className="text-text-color group-hover:text-[#2D6A73] transition-colors">{agent.label}</div>
                    <div className="text-[10px] text-muted-color">{agent.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Repository */}
            <div className="text-[10px] font-code text-muted-color mb-3 tracking-widest uppercase">
              Repository
            </div>
            <div className="flex flex-col gap-2 pl-[18px] font-code text-xs text-muted-color">
              <div>11 files</div>
              <div>7 commits</div>
              <div>4 agents</div>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="pr-4 mt-4 flex flex-col gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className={`text-xs font-code flex items-center gap-1.5 transition-colors ${
                isLive
                  ? 'text-[#4F6854] hover:text-[#4F6854]/80'
                  : 'text-muted-color hover:text-text-color'
              }`}
              aria-label="Open API settings (Ctrl+,)"
              title="API Settings (Ctrl+,)"
            >
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${isLive ? 'bg-[#4F6854]' : 'bg-[#A84A32]'}`} />
              {isLive ? 'Live API' : 'Mock Data'}
            </button>
            <button
              onClick={toggle}
              className="text-xs font-code text-muted-color hover:text-text-color transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '◑ Light mode' : '◐ Dark mode'}
            </button>
          </div>
        </aside>

        {/* Main Exploration Area */}
        <main className="flex-1 flex flex-col bg-bg-color relative overflow-hidden">
          {/* View Router */}
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<QueryView />} />
              <Route path="/graph" element={<GraphView />} />
              <Route path="/timeline" element={<TimelineView />} />
            </Routes>
          </div>

          {/* Status Bar */}
          <div className="border-t border-border-color bg-bg-color px-4 py-2 flex items-center justify-between text-[10px] font-code shrink-0">
            <div className="flex items-center gap-4 text-muted-color">
              <span className="flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 bg-[#4F6854] rounded-full inline-block" aria-hidden="true" />
                Memory Synchronized
              </span>
              <span>17 nodes indexed</span>
              <span>core active</span>

              {/* Mode badge — clickable */}
              <button
                onClick={() => setSettingsOpen(true)}
                className={`border px-1.5 py-0.5 transition-colors ${
                  isLive
                    ? 'text-[#4F6854] border-[#4F6854]/30 hover:bg-[#4F6854]/5'
                    : 'text-[#A84A32] border-[#A84A32]/30 hover:bg-[#A84A32]/5'
                }`}
                title="Open API settings"
              >
                {isLive
                  ? `LIVE — ${config.url}`
                  : 'LOCAL MOCK MEMORY'}
              </button>
            </div>
            <div className="flex items-center gap-3 text-muted-color">
              <button
                onClick={() => setSettingsOpen(true)}
                className="hover:text-text-color transition-colors"
                title="API Settings (Ctrl+,)"
              >
                ⚙ API
              </button>
              <button
                onClick={() => setPaletteOpen(true)}
                className="hover:text-text-color transition-colors"
                aria-label="Open command palette (Ctrl+K)"
              >
                ⌘K Search
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onToggleTheme={toggle}
        onOpenSettings={() => { setPaletteOpen(false); setSettingsOpen(true); }}
      />

      {/* API Settings Panel */}
      <ApiSettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
      } />
    </Routes>
  );
}
