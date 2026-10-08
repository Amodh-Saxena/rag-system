import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTimeline } from '../lib/api';
import type { TimelineEvent } from '../lib/types';
import { ChevronDown, ChevronRight, GitCommit } from 'lucide-react';

const MEMORY_TYPE_COLORS = {
  episodic: { text: 'text-[#A84A32]', bg: 'bg-[#A84A32]/8 border-[#A84A32]/25', bar: 'bg-[#A84A32]' },
  semantic: { text: 'text-[#4F6854]', bg: 'bg-[#4F6854]/8 border-[#4F6854]/25', bar: 'bg-[#4F6854]' },
  temporal: { text: 'text-[#2D6A73]', bg: 'bg-[#2D6A73]/8 border-[#2D6A73]/25', bar: 'bg-[#2D6A73]' },
};

// ─── Event card ────────────────────────────────────────────────────────────────

function EventCard({
  event,
  active,
  onNavigate,
}: {
  event: TimelineEvent;
  active: boolean;
  onNavigate: (nodeId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = MEMORY_TYPE_COLORS[event.memoryType];

  return (
    <div
      className={`border transition-all duration-200 ${
        active ? `${colors.bg} border-current` : 'border-border-color'
      }`}
      style={{ opacity: active ? 1 : 0.35 }}
    >
      {/* Header */}
      <button
        className="w-full text-left px-4 py-3 flex items-start gap-4"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        {/* Date */}
        <div className="shrink-0 w-14">
          <div className={`text-xs font-code ${colors.text} leading-tight`}>{event.date}</div>
        </div>

        {/* Activity bar */}
        <div className="shrink-0 flex items-center pt-1">
          <div className={`w-1.5 h-6 ${colors.bar} opacity-60 rounded-sm`} />
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-text-color font-body">{event.title}</div>
          <div className="text-xs font-code text-muted-color mt-0.5 flex items-center gap-1.5">
            <GitCommit size={10} />
            {event.commit}
          </div>
        </div>

        {/* Expand icon */}
        <div className="shrink-0 text-muted-color pt-0.5">
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border-color/50 ml-[74px]">
          {/* Files affected */}
          <div className="mt-3 mb-3">
            <div className="text-xs font-code text-muted-color uppercase tracking-widest mb-2">Files Affected</div>
            <div className="flex flex-col gap-1">
              {event.filesAffected.map((f) => (
                <div key={f} className="text-xs font-code text-text-color flex items-center gap-1.5">
                  <span className="text-muted-color">├</span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div className="mb-3">
            <div className="text-xs font-code text-muted-color uppercase tracking-widest mb-1">Why</div>
            <p className="text-xs text-text-color leading-relaxed border-l-2 border-border-color pl-3">
              {event.reason}
            </p>
          </div>

          {/* Detail */}
          <div className="mb-3">
            <div className="text-xs font-code text-muted-color uppercase tracking-widest mb-1">What Changed</div>
            <p className="text-xs text-text-color leading-relaxed">{event.detail}</p>
          </div>

          {/* Commit link */}
          <button
            onClick={() => onNavigate(`commit-${event.commit.slice(0, 5)}`)}
            className={`text-xs font-code ${colors.text} hover:underline`}
          >
            commit {event.commit} →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── TimelineView ─────────────────────────────────────────────────────────────

export function TimelineView() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrubberValue, setScrubberValue] = useState(100); // 0–100 maps to date range
  const navigate = useNavigate();

  useEffect(() => {
    getTimeline().then((evts) => {
      setEvents(evts);
      setLoading(false);
    });
  }, []);

  // Derive date range
  const dates = events.map((e) => new Date(e.isoDate).getTime()).sort();
  const minDate = dates[0] ?? Date.now();
  const maxDate = dates[dates.length - 1] ?? Date.now();

  // Which date the scrubber points to
  const scrubDate = new Date(minDate + (scrubberValue / 100) * (maxDate - minDate));

  // Only show events on or before scrubDate
  const isEventActive = (event: TimelineEvent) =>
    new Date(event.isoDate).getTime() <= scrubDate.getTime();

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNodeNavigate = (_nodeId: string) => {
    navigate('/graph');
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="text-xs font-code text-muted-color animate-pulse">Excavating episodic history...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto">
          <div className="mb-2">
            <span className="text-xs font-code text-muted-color uppercase tracking-widest">
              Episodic + Temporal Memory
            </span>
          </div>
          <h2 className="font-display text-xl text-text-color mb-6">Repository Timeline</h2>

          {/* Scrubber */}
          <div className="mb-10">
            <div className="flex items-center justify-between text-xs font-code text-muted-color mb-2">
              <span>{formatDate(minDate)}</span>
              <span className="text-text-color">{formatDate(scrubDate.getTime())}</span>
              <span>{formatDate(maxDate)}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={0}
                max={100}
                value={scrubberValue}
                onChange={(e) => setScrubberValue(Number(e.target.value))}
                className="w-full h-0.5 bg-border-color rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #A84A32 ${scrubberValue}%, var(--border-color) ${scrubberValue}%)`,
                }}
                aria-label="Timeline scrubber"
                aria-valuetext={formatDate(scrubDate.getTime())}
              />
            </div>
            <div className="mt-2 text-xs font-code text-muted-color text-center">
              Showing history up to{' '}
              <span className="text-text-color">{formatDate(scrubDate.getTime())}</span>
              {' '}· {events.filter((e) => isEventActive(e)).length} of {events.length} events
            </div>
          </div>

          {/* Stratified timeline layers */}
          <div className="relative">
            {/* Axis line */}
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border-color" />

            <div className="flex flex-col gap-0">
              {events.map((event) => {
                const active = isEventActive(event);
                const colors = MEMORY_TYPE_COLORS[event.memoryType];
                return (
                  <div key={event.id} className="relative pl-10">
                    {/* Dot on timeline axis */}
                    <div
                      className={`absolute left-2 top-4 w-3 h-3 border rounded-sm rotate-45 transition-all duration-300 ${
                        active
                          ? `${colors.bar} border-transparent`
                          : 'bg-bg-color border-border-color'
                      }`}
                    />

                    {/* Activity strata bar */}
                    <div className="mb-1 flex gap-2 items-center">
                      <div
                        className={`h-1.5 rounded-sm transition-all duration-300 ${colors.bar}`}
                        style={{
                          width: active ? `${60 + event.filesAffected.length * 12}px` : '20px',
                          opacity: active ? 0.7 : 0.15,
                        }}
                      />
                    </div>

                    {/* Event card */}
                    <div className="mb-4">
                      <EventCard
                        event={event}
                        active={active}
                        onNavigate={handleNodeNavigate}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* OLDEST marker */}
            <div className="pl-10 mt-2">
              <div className="text-xs font-code text-muted-color uppercase tracking-widest border-t border-border-color pt-3">
                ─ Earliest memory
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side legend */}
      <div className="w-48 border-l border-border-color px-5 py-8 shrink-0 hidden lg:block">
        <div className="text-xs font-code text-muted-color uppercase tracking-widest mb-4">Memory Types</div>
        <div className="flex flex-col gap-3">
          {(['episodic', 'semantic', 'temporal'] as const).map((type) => {
            const colors = MEMORY_TYPE_COLORS[type];
            const count = events.filter((e) => e.memoryType === type && isEventActive(e)).length;
            return (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colors.bar}`} />
                  <span className={`text-xs font-code ${colors.text} capitalize`}>{type}</span>
                </div>
                <span className="text-xs font-code text-muted-color">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-xs font-code text-muted-color uppercase tracking-widest mb-4">
          Active Files
        </div>
        <div className="flex flex-col gap-1.5">
          {Array.from(
            new Set(
              events
                .filter((e) => isEventActive(e))
                .flatMap((e) => e.filesAffected),
            ),
          )
            .slice(0, 8)
            .map((f) => (
              <div key={f} className="text-xs font-code text-muted-color truncate" title={f}>
                {f.split('/').pop()}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
