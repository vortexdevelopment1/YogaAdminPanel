// Funnel visualization component displaying visitor progress and step-by-step drop-offs

import { JourneyStep } from "@/types";
import { getDropOffPercent } from "@/lib/utils";

interface JourneyFunnelProps {
  steps: JourneyStep[];
}

export default function JourneyFunnel({ steps }: JourneyFunnelProps) {
  if (!steps.length) return null;

  const baselineVisitors = steps[0].visitors;

  return (
    <div className="space-y-3 py-1">
      {steps.map((step, idx) => {
        const percent = Math.round((step.visitors / baselineVisitors) * 100);
        const nextStep = steps[idx + 1];
        const dropOff = nextStep
          ? getDropOffPercent(step.visitors, nextStep.visitors)
          : null;

        return (
          <div key={step.step} className="space-y-1.5">
            {/* Step label & visitor metrics */}
            <div className="flex items-center justify-between text-xs md:text-sm font-medium">
              <span className="text-charcoal font-semibold">{step.step}</span>
              <span className="text-warmgray">
                <strong className="text-forest font-semibold">{step.visitors.toLocaleString()}</strong> ({percent}%)
              </span>
            </div>

            {/* Funnel Bar */}
            <div className="w-full h-4 bg-sand/60 rounded-lg overflow-hidden">
              <div
                className="h-full bg-sage rounded-lg transition-all duration-300"
                style={{
                  width: `${percent}%`,
                  opacity: Math.max(0.45, 1 - idx * 0.12),
                }}
              />
            </div>

            {/* Drop-off Indicator between steps */}
            {dropOff !== null && (
              <div className="flex items-center gap-1.5 pl-2 py-0.5 text-[11px] font-semibold text-terracotta">
                <span>↓</span>
                <span>{dropOff}% drop-off</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
