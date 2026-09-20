import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DEVICE_CONFIGS, DeviceGroup } from '../types';

const POPOVER_MIN_WIDTH = 320;
const POPOVER_MAX_HEIGHT = 420;
const VERTICAL_MARGIN = 8;
const MIN_BELOW_SPACE = 200;
const TRIGGER_GAP = 6;

type PopoverPosition = {
  horizontalAlign: 'left' | 'right';
  placement: 'bottom' | 'top';
  maxHeight: number;
};

interface DeviceSelectProps {
  value: string;
  onChange: (deviceType: string) => void;
  disabled?: boolean;
  /** Optional override of the trigger width — defaults to fit content. */
  triggerClassName?: string;
}

const GROUP_ORDER: DeviceGroup[] = ['Other', 'Phone', 'Tablet', 'Android'];
const GROUP_LABEL: Record<DeviceGroup, string> = {
  Other: 'Default',
  Phone: 'Phone',
  Tablet: 'Tablet',
  Android: 'Android',
};

function formatLabel(name: string, w: number, h: number) {
  if (w <= 0 || h <= 0) return name;
  return `${name} — ${w}×${h}`;
}

/**
 * Trigger button + grouped popover for picking a device preset.
 * Visual model mirrors Moon's MDS dropdown (rounded pill trigger,
 * card-style popover with section headers + radio rows).
 */
export default function DeviceSelect({
  value, onChange, disabled, triggerClassName,
}: DeviceSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<PopoverPosition>({
    horizontalAlign: 'left',
    placement: 'bottom',
    maxHeight: POPOVER_MAX_HEIGHT,
  });

  // Measure trigger + viewport to decide popover anchor, flip, and max-height.
  useLayoutEffect(() => {
    if (!open) return;

    const measure = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Horizontal: if left-anchored popover would overflow the right edge,
      // anchor to the right edge of the trigger instead. Prefer right when
      // neither side fits cleanly.
      const roomRightOfLeftEdge = vw - rect.left;
      const roomLeftOfRightEdge = rect.right;
      let horizontalAlign: 'left' | 'right' = 'left';
      if (roomRightOfLeftEdge < POPOVER_MIN_WIDTH) {
        horizontalAlign = 'right';
      } else if (
        roomRightOfLeftEdge < POPOVER_MIN_WIDTH &&
        roomLeftOfRightEdge < POPOVER_MIN_WIDTH
      ) {
        horizontalAlign = 'right';
      }

      // Vertical: pick below if there's ≥ MIN_BELOW_SPACE, otherwise flip.
      const spaceBelow = vh - rect.bottom - TRIGGER_GAP;
      const spaceAbove = rect.top - TRIGGER_GAP;
      const placement: 'bottom' | 'top' =
        spaceBelow >= MIN_BELOW_SPACE ? 'bottom' : 'top';
      const chosenSpace = placement === 'bottom' ? spaceBelow : spaceAbove;
      const maxHeight = Math.max(
        120,
        Math.min(POPOVER_MAX_HEIGHT, chosenSpace - VERTICAL_MARGIN),
      );

      setPosition({ horizontalAlign, placement, maxHeight });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [open]);

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = DEVICE_CONFIGS[value];
  const triggerLabel = current
    ? formatLabel(current.name, current.width, current.height)
    : value;

  const grouped = GROUP_ORDER
    .map((g) => ({
      group: g,
      items: Object.values(DEVICE_CONFIGS).filter((d) => d.group === g),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={triggerLabel}
        className={`
          h-9 pl-3 pr-2 rounded-md border
          flex items-center gap-2 text-[12px] font-medium
          transition-colors duration-150 cursor-pointer
          disabled:opacity-40 disabled:cursor-not-allowed
          ${open
            ? 'border-primary/40 bg-card text-foreground'
            : 'border-border bg-card text-foreground hover:border-border/80'}
          ${triggerClassName ?? 'min-w-[200px]'}
        `}
      >
        <span className="truncate flex-1 text-left">{triggerLabel}</span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`
            float-in absolute z-[200]
            min-w-[320px] overflow-y-auto
            rounded-lg border border-border bg-popover
            shadow-[var(--shadow-popover)]
            p-1
            ${position.horizontalAlign === 'right' ? 'right-0' : 'left-0'}
            ${position.placement === 'top'
              ? 'bottom-[calc(100%+6px)]'
              : 'top-[calc(100%+6px)]'}
          `}
          style={{ maxHeight: `${position.maxHeight}px` }}
          role="listbox"
        >
          {grouped.map(({ group, items }, gi) => (
            <div key={group}>
              {/* Section header — small caps tracked, hide for the first "Default" group */}
              {gi > 0 && (
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    {GROUP_LABEL[group]}
                  </p>
                </div>
              )}

              {items.map((d) => {
                const active = d.name === value;
                return (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => { onChange(d.name); setOpen(false); }}
                    role="option"
                    aria-selected={active}
                    className={`
                      w-full flex items-center gap-3 pl-3 pr-2 h-10 rounded-md
                      text-left transition-colors duration-100 cursor-pointer
                      ${active
                        ? 'bg-primary-soft text-foreground'
                        : 'text-foreground hover:bg-muted'}
                    `}
                  >
                    <span className="text-[13px] flex-1 truncate">
                      {formatLabel(d.name, d.width, d.height)}
                    </span>

                    {/* Radio circle */}
                    <span
                      className={`
                        relative w-4 h-4 rounded-full border shrink-0
                        flex items-center justify-center
                        ${active ? 'border-primary' : 'border-border'}
                      `}
                    >
                      {active && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
