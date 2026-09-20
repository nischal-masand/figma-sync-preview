import { useState, useEffect, useRef, UIEvent } from 'react';
import { Plus } from 'lucide-react';
import SelectionChip from './components/SelectionChip';
import DeviceSelect from './components/DeviceSelect';
import PreviewGrid from './components/PreviewGrid';
import EmptyState from './components/EmptyState';
import ScrollSyncToggle from './components/ScrollSyncToggle';
import ThemeToggle from './components/ThemeToggle';
import { BRAND_ICON_DATA_URL } from './assets/brandIcon';
import { FrameData, Panel, UIMessage, PluginMessage } from './types';

type Theme = 'light' | 'dark';

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const MAX_PANELS = 4;
const DEFAULT_DEVICE = 'iPhone 17';

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return (localStorage.getItem('fp-theme') as Theme) || 'light'; } catch { return 'light'; }
  });
  const [, setFrames] = useState<FrameData[]>([]);
  const [selectedFrames, setSelectedFrames] = useState<FrameData[]>([]);
  const [panels, setPanels] = useState<Panel[]>([]);
  const [scrollSyncEnabled, setScrollSyncEnabled] = useState(true);
  const [, setLoading] = useState<Record<string, boolean>>({});
  const [device, setDevice] = useState<string>(DEFAULT_DEVICE);

  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const activeScrollSource = useRef<string | null>(null);

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
    try { localStorage.setItem('fp-theme', t); } catch {}
  };

  useEffect(() => {
    window.onmessage = (event: MessageEvent<UIMessage>) => {
      const msg = event.data.pluginMessage as UIMessage;

      if (msg.type === 'FRAMES_LIST') setFrames(msg.frames);

      if (msg.type === 'SELECTION_CHANGED') setSelectedFrames(msg.selectedFrames);

      if (msg.type === 'FRAME_IMAGE') {
        if (msg.panelId) {
          setPanels((prev) =>
            prev.map((p) =>
              p.id === msg.panelId
                ? { ...p, imageData: msg.image, frameName: msg.name, width: msg.width, height: msg.height }
                : p
            )
          );
        } else {
          setPanels((prev) => [...prev, {
            id: generateId(), frameId: msg.frameId, imageData: msg.image,
            frameName: msg.name, deviceType: msg.deviceType, width: msg.width, height: msg.height,
          }]);
        }
        setLoading((prev) => ({ ...prev, [msg.frameId]: false }));
      }

      if (msg.type === 'ERROR') {
        console.error('Plugin error:', msg.message);
        alert(`Error: ${msg.message}`);
      }
    };

    sendMessage({ type: 'GET_FRAMES' });
    sendMessage({ type: 'GET_SELECTION' });
  }, []);

  const sendMessage = (message: PluginMessage) => {
    parent.postMessage({ pluginMessage: message }, '*');
  };

  const slotsLeft = Math.max(0, MAX_PANELS - panels.length);
  const canAdd = selectedFrames.length > 0 && slotsLeft > 0;

  const handleAddSelected = () => {
    if (!canAdd) return;
    const toAdd = selectedFrames.slice(0, slotsLeft);
    toAdd.forEach((f) => {
      setLoading((prev) => ({ ...prev, [f.id]: true }));
      sendMessage({ type: 'EXPORT_FRAME', frameId: f.id, deviceType: device, scale: 2 });
    });
  };

  const handleRemovePanel = (id: string) => {
    setPanels((prev) => prev.filter((p) => p.id !== id));
    delete scrollRefs.current[id];
  };

  const handleRefreshPanel = (panelId: string) => {
    const panel = panels.find((p) => p.id === panelId);
    if (panel) {
      setLoading((prev) => ({ ...prev, [panel.frameId]: true }));
      sendMessage({ type: 'REFRESH_FRAME', frameId: panel.frameId, deviceType: panel.deviceType, scale: 2, panelId: panel.id });
    }
  };

  const handleChangePanelDevice = (panelId: string, deviceType: string) => {
    setPanels((prev) => prev.map((p) => (p.id === panelId ? { ...p, deviceType } : p)));
  };

  const handleScroll = (panelId: string, event: UIEvent<HTMLDivElement>) => {
    if (!scrollSyncEnabled) return;
    if (activeScrollSource.current && activeScrollSource.current !== panelId) return;

    const source = event.currentTarget;
    const maxScrollX = source.scrollWidth - source.clientWidth;
    const maxScrollY = source.scrollHeight - source.clientHeight;
    const scrollPercentX = maxScrollX > 0 ? source.scrollLeft / maxScrollX : 0;
    const scrollPercentY = maxScrollY > 0 ? source.scrollTop / maxScrollY : 0;

    Object.entries(scrollRefs.current).forEach(([id, ref]) => {
      if (id !== panelId && ref) {
        ref.scrollLeft = isFinite(scrollPercentX * (ref.scrollWidth - ref.clientWidth)) ? scrollPercentX * (ref.scrollWidth - ref.clientWidth) : 0;
        ref.scrollTop  = isFinite(scrollPercentY * (ref.scrollHeight - ref.clientHeight)) ? scrollPercentY * (ref.scrollHeight - ref.clientHeight) : 0;
      }
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX, startY = e.clientY;
    const startW = window.innerWidth, startH = window.innerHeight;
    const onMove = (ev: MouseEvent) => sendMessage({ type: 'RESIZE', width: Math.round(startW + ev.clientX - startX), height: Math.round(startH + ev.clientY - startY) });
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      className={`
        ${theme === 'dark' ? 'dark' : ''}
        flex flex-col h-screen bg-background text-foreground relative overflow-hidden
      `}
    >
      {/* ── Toolbar ───────────────────────────────────────────── */}
      <header className="shrink-0 px-3 pt-3 pb-3">
        <div
          className="
            flex items-center gap-3 h-[64px] px-4 rounded-2xl
            border border-border bg-card
            shadow-[var(--shadow-card)]
          "
        >
          {/* Brand mark — Multiview logo (PNG) + wordmark.
              The PNG already includes the purple tile, so no bg wrapper. */}
          <div className="flex items-center gap-2 shrink-0 pr-1">
            <img
              src={BRAND_ICON_DATA_URL}
              alt="Multiview"
              width={28}
              height={28}
              className="w-7 h-7 shrink-0 select-none"
              draggable={false}
            />
            <span className="text-[13px] font-semibold text-foreground tracking-tight leading-none whitespace-nowrap">
              Multiview
            </span>
          </div>

          {/* Left spacer */}
          <div className="flex-1" />

          {/* Center cluster — selection chip + device select + CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Selection chip — surfaces the canvas selection */}
            <SelectionChip
              selectedFrames={selectedFrames}
              maxPanels={MAX_PANELS}
              currentPanelCount={panels.length}
            />

            {/* Device select */}
            <DeviceSelect value={device} onChange={setDevice} />

            {/* Primary CTA */}
            <button
              onClick={handleAddSelected}
              disabled={!canAdd}
              className="
                h-9 px-3.5 rounded-md shrink-0
                flex items-center gap-1.5
                bg-primary text-primary-foreground
                text-[12px] font-semibold
                hover:opacity-90 active:opacity-80
                transition-opacity duration-100
                disabled:opacity-40 disabled:cursor-not-allowed
              "
              title={canAdd ? 'Add the selected frame to a preview panel' : 'Select a frame on the canvas first'}
            >
              <Plus size={13} strokeWidth={2.5} />
              Add selected frame
            </button>
          </div>

          {/* Right spacer */}
          <div className="flex-1" />

          {/* Right controls */}
          <ScrollSyncToggle enabled={scrollSyncEnabled} onChange={setScrollSyncEnabled} />
          <div className="w-px h-5 bg-border shrink-0" />
          <ThemeToggle theme={theme} onChange={handleThemeChange} />
        </div>
      </header>

      {/* ── Canvas / body ─────────────────────────────────────── */}
      <main className="flex-1 min-h-0 overflow-hidden px-3 pb-3">
        {panels.length === 0 ? (
          <EmptyState />
        ) : (
          <PreviewGrid
            panels={panels}
            onRemovePanel={handleRemovePanel}
            onRefreshPanel={handleRefreshPanel}
            onChangePanelDevice={handleChangePanelDevice}
            scrollRefs={scrollRefs}
            onScroll={handleScroll}
            onMouseEnterPanel={(panelId) => { activeScrollSource.current = panelId; }}
            onMouseLeavePanel={() => { activeScrollSource.current = null; }}
          />
        )}
      </main>

      {/* ── Resize handle (bottom-right 6-dot grip) ───────────── */}
      <div
        onMouseDown={handleResizeStart}
        title="Drag to resize"
        className="absolute bottom-0 right-0 w-7 h-7 cursor-se-resize z-50 flex items-end justify-end pb-1.5 pr-1.5 group"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          className="text-muted-foreground/70 group-hover:text-primary transition-colors duration-150"
        >
          <circle cx="11.5" cy="11.5" r="1.6" fill="currentColor" />
          <circle cx="11.5" cy="7"    r="1.6" fill="currentColor" />
          <circle cx="7"    cy="11.5" r="1.6" fill="currentColor" />
          <circle cx="11.5" cy="2.5"  r="1.6" fill="currentColor" />
          <circle cx="7"    cy="7"    r="1.6" fill="currentColor" />
          <circle cx="2.5"  cy="11.5" r="1.6" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
