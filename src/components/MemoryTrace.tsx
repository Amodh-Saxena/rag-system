import { useEffect, useState } from 'react';
import type { TraceStep } from '../lib/types';

interface MemoryTraceProps {
  steps: TraceStep[];
  visible: boolean;
}

const MEMORY_TYPE_COLORS: Record<string, string> = {
  episodic: 'text-[#A84A32]',
  semantic: 'text-[#4F6854]',
  temporal: 'text-[#2D6A73]',
};

const MEMORY_TYPE_BG: Record<string, string> = {
  episodic: 'bg-[#A84A32]/10 border-[#A84A32]/30',
  semantic: 'bg-[#4F6854]/10 border-[#4F6854]/30',
  temporal: 'bg-[#2D6A73]/10 border-[#2D6A73]/30',
};

export function MemoryTrace({ steps, visible }: MemoryTraceProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!visible) {
      setRevealedCount(0);
      return;
    }

    // Check for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setRevealedCount(steps.length);
      return;
    }

    setRevealedCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setRevealedCount(i);
      if (i >= steps.length) clearInterval(interval);
    }, 180);

    return () => clearInterval(interval);
  }, [visible, steps]);

  if (!visible) return null;

  return (
    <div className="border-l-2 border-border-color pl-6 py-2 space-y-0">
      <div className="text-xs font-code text-muted-color uppercase tracking-widest mb-4">
        Memory Trace
      </div>
      {steps.map((step, idx) => {
        const revealed = idx < revealedCount;
        const color = step.memoryType ? MEMORY_TYPE_COLORS[step.memoryType] : 'text-muted-color';
        const bg = step.memoryType ? MEMORY_TYPE_BG[step.memoryType] : '';

        return (
          <div
            key={step.id}
            className={`relative transition-all duration-200 ${revealed ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: `${idx * 30}ms` }}
          >
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div
                className={`absolute left-[-25px] top-6 w-px h-full bg-border-color transition-opacity duration-300 ${revealed ? 'opacity-100' : 'opacity-0'}`}
              />
            )}

            {/* Node dot */}
            <div className="flex items-start gap-3 pb-4">
              <div
                className={`absolute left-[-29px] top-1.5 w-2 h-2 rounded-full border transition-all duration-200 ${
                  step.memoryType
                    ? `border-current ${color}`
                    : 'border-border-color bg-bg-color'
                } ${revealed ? 'scale-100' : 'scale-0'}`}
              />

              <div className="flex-1 min-w-0">
                <div className={`flex items-center gap-2 flex-wrap`}>
                  <span className={`text-xs font-code font-medium ${color}`}>
                    {step.memoryType ? step.memoryType.toUpperCase() : ''}
                  </span>
                  <span className="text-sm font-body text-text-color">{step.label}</span>
                </div>
                {step.detail && (
                  <div className={`mt-1 text-xs font-code px-2 py-1 rounded-sm border ${bg || 'bg-black/5 dark:bg-white/5 border-border-color'} text-muted-color`}>
                    {step.detail}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
