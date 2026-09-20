import { Layers } from 'lucide-react';

const STEPS = [
  { n: 1, label: 'Select a frame on the Figma canvas' },
  { n: 2, label: 'Pick a device size from the dropdown' },
  { n: 3, label: 'Click "Add selected frame" to compare' },
] as const;

/**
 * Empty-state body shown when no preview panels exist yet.
 * Mirrors the Figma "Empty light" reference (122:915):
 * hero icon → headline → subtext → 3 numbered step cards.
 */
export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 pb-8">
      <div className="w-full max-w-[360px] flex flex-col items-center text-center">

        {/* Hero icon — soft primary tile with subtle border */}
        <div className="relative mb-6">
          <div className="absolute inset-0 blur-2xl bg-primary/15 rounded-full scale-[1.8]" />
          <div
            className="
              relative w-14 h-14 rounded-2xl
              bg-primary-soft border border-primary-soft-border
              flex items-center justify-center
            "
          >
            <Layers size={24} strokeWidth={1.5} className="text-primary" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-[17px] font-semibold text-foreground tracking-tight leading-snug mb-2">
          Compare frames, side by side
        </h2>

        {/* Subtext */}
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-7 max-w-[320px]">
          Preview your designs on device mockups and sync scrolling across up to 4 panels.
        </p>

        {/* Step cards */}
        <div className="w-full flex flex-col gap-2">
          {STEPS.map(({ n, label }) => (
            <div
              key={n}
              className="
                flex items-center gap-3 px-3.5 py-3 rounded-lg
                bg-card border border-border text-left
              "
            >
              <span
                className="
                  w-[22px] h-[22px] rounded-full shrink-0
                  bg-primary-soft text-primary
                  text-[11px] font-bold
                  flex items-center justify-center
                "
              >
                {n}
              </span>
              <span className="text-[12.5px] text-muted-foreground leading-snug">
                {label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
