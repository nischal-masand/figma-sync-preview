import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

interface ThemeToggleProps {
  theme: Theme;
  onChange: (t: Theme) => void;
}

/**
 * Sun/moon toggle that mirrors Moon's `toggle-dark` component (131:1741).
 *
 * Spec:
 *   Track 44×24, fully rounded, beerus gray track in BOTH states
 *   (the track itself doesn't change color — only the knob slides).
 *   Knob 16×16 white, inset 4px on every side, translates 20px when dark.
 *   Sun icon fixed on the LEFT side of the track, moon on the RIGHT.
 *   The knob sits over the icon for the currently active mode, so the
 *   visible (uncovered) icon is the mode you'd switch to.
 */
export default function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => onChange(isDark ? 'light' : 'dark')}
      role="switch"
      aria-checked={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        relative shrink-0 h-6 w-11 rounded-full
        bg-switch-background
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
      "
    >
      {/* Fixed track icons — small, low contrast */}
      <span className="absolute top-1 left-1 h-4 w-4 flex items-center justify-center text-foreground/55 pointer-events-none">
        <Sun size={10} strokeWidth={2.25} />
      </span>
      <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center text-foreground/55 pointer-events-none">
        <Moon size={10} strokeWidth={2.25} />
      </span>

      {/* Sliding knob — covers the icon for the *currently active* mode */}
      <span
        className={`
          absolute top-1 left-1 h-4 w-4 rounded-full
          bg-white shadow-[0_1px_2px_rgba(0,0,0,0.20)]
          transition-transform duration-200 ease-out
          ${isDark ? 'translate-x-[20px]' : 'translate-x-0'}
        `}
      />
    </button>
  );
}
