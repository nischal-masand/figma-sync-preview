import { FrameData } from '../types';

interface SelectionChipProps {
  selectedFrames: FrameData[];
  maxPanels: number;
  currentPanelCount: number;
}

/**
 * Cap the displayed frame name so the chip stays compact even when the
 * source frame has a verbose name (`MDS-Public-TW-Switch`, etc.).
 * Head-truncate with an ellipsis — full name remains in the hover title.
 */
const MAX_NAME_CHARS = 16;
function truncateName(name: string): string {
  if (name.length <= MAX_NAME_CHARS) return name;
  return name.slice(0, MAX_NAME_CHARS - 1).trimEnd() + '…';
}

/**
 * Surfaces the user's current Figma canvas selection inside the toolbar
 * — a rounded pill showing the first selected frame's name with a
 * "Selected" tag in primary. When more than one frame is selected, the
 * tag becomes "+N selected" so the user knows the click on "Add selected
 * frame" will pull multiple at once.
 */
export default function SelectionChip({
  selectedFrames, maxPanels, currentPanelCount,
}: SelectionChipProps) {
  const slotsLeft = Math.max(0, maxPanels - currentPanelCount);

  if (selectedFrames.length === 0 || slotsLeft === 0) {
    // Empty / disabled state — still rendered so the toolbar layout doesn't jump
    return (
      <div
        className="
          shrink-0 h-9 px-3 rounded-md
          bg-muted border border-border
          flex items-center gap-2 min-w-[200px] max-w-[260px]
        "
      >
        <span className="text-[12px] text-muted-foreground truncate">
          {slotsLeft === 0 ? 'Max panels reached' : 'No frame selected'}
        </span>
      </div>
    );
  }

  const first = selectedFrames[0];
  const extras = selectedFrames.length - 1;
  // Cap how many will actually be added based on remaining slots
  const willAdd = Math.min(selectedFrames.length, slotsLeft);
  const displayName = truncateName(first.name);

  return (
    <div
      className="
        shrink-0 h-9 px-3 rounded-md
        bg-muted border border-border
        flex items-center gap-2 min-w-[200px] max-w-[260px]
      "
      title={
        selectedFrames.length === 1
          ? first.name
          : `${selectedFrames.map((f) => f.name).join(', ')}\n${willAdd} of ${selectedFrames.length} will be added`
      }
    >
      <span className="text-[12px] text-foreground font-medium truncate min-w-0 flex-1">
        {displayName}
      </span>
      <span className="text-[11px] font-semibold text-primary whitespace-nowrap shrink-0">
        {extras > 0 ? `+${extras} selected` : 'Selected'}
      </span>
    </div>
  );
}
