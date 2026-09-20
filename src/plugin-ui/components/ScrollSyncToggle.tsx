interface ScrollSyncToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

/**
 * "Sync scroll" + Moon-style switch.
 *
 * Spec from Figma "Sync switch" (122:733):
 *   Track 44×24, fully rounded.
 *   Off → beerus gray (--switch-background). On → piccolo (--primary).
 *   Knob 16×16 white, inset 4px on every side. Translates 20px to the right
 *   when ON (4 → 24, so it sits 4px from the right edge).
 *   Sync wrap gap between label and switch is 6px (gap-1.5).
 */
export default function ScrollSyncToggle({ enabled, onChange }: ScrollSyncToggleProps) {
  return (
    <label
      className="flex items-center gap-1.5 cursor-pointer select-none shrink-0"
      title={enabled ? 'Scroll sync is on' : 'Scroll sync is off'}
    >
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />

      <span className="text-[12px] font-medium text-muted-foreground leading-none">
        Sync scroll
      </span>

      {/* Track */}
      <span
        className={`
          relative shrink-0 h-6 w-11 rounded-full
          transition-colors duration-200
          ${enabled ? 'bg-primary' : 'bg-switch-background'}
        `}
      >
        {/* Knob — 16×16 with 4px inset, slides 20px */}
        <span
          className={`
            absolute top-1 left-1 h-4 w-4 rounded-full
            bg-white shadow-[0_1px_2px_rgba(0,0,0,0.20)]
            transition-transform duration-200 ease-out
            ${enabled ? 'translate-x-[20px]' : 'translate-x-0'}
          `}
        />
      </span>
    </label>
  );
}
