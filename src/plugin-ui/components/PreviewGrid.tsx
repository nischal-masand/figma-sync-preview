import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { UIEvent, useEffect, useRef, useState } from 'react';
import PreviewPanel from './PreviewPanel';
import { Panel as PanelType } from '../types';

interface PreviewGridProps {
  panels: PanelType[];
  onRemovePanel: (id: string) => void;
  onRefreshPanel: (id: string) => void;
  onChangePanelDevice: (id: string, deviceType: string) => void;
  scrollRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  onScroll: (panelId: string, event: UIEvent<HTMLDivElement>) => void;
  onMouseEnterPanel: (panelId: string) => void;
  onMouseLeavePanel?: () => void;
}

/**
 * Breakpoints (px of available canvas width) for switching layouts.
 * Each panel needs ~320px to render a phone mock comfortably; gaps live
 * on top of that. These thresholds were chosen so the device frames keep
 * a usable scale.
 */
const BREAKPOINT_3UP_ROW = 1200; // 3 panels go side-by-side instead of L-shape
const BREAKPOINT_4UP_ROW = 1600; // 4 panels go in a single row instead of 2×2

const Handle = ({ direction = 'h' }: { direction?: 'h' | 'v' }) => (
  <PanelResizeHandle
    className={
      direction === 'h'
        ? 'w-2 flex items-center justify-center group'
        : 'h-2 flex justify-center items-center group'
    }
  >
    <div
      className={
        direction === 'h'
          ? 'w-[3px] h-8 rounded-full bg-border group-hover:bg-primary/50 transition-colors duration-150'
          : 'h-[3px] w-8 rounded-full bg-border group-hover:bg-primary/50 transition-colors duration-150'
      }
    />
  </PanelResizeHandle>
);

function renderPanel(p: PanelType, props: PreviewGridProps) {
  return (
    <PreviewPanel
      key={p.id}
      ref={(el) => (props.scrollRefs.current[p.id] = el)}
      frameId={p.id}
      imageData={p.imageData}
      frameName={p.frameName}
      deviceType={p.deviceType}
      width={p.width}
      height={p.height}
      onRemove={() => props.onRemovePanel(p.id)}
      onRefresh={() => props.onRefreshPanel(p.id)}
      onChangeDevice={(d) => props.onChangePanelDevice(p.id, d)}
      onScroll={(e) => props.onScroll(p.id, e)}
      onMouseEnter={() => props.onMouseEnterPanel(p.id)}
      onMouseLeave={props.onMouseLeavePanel}
    />
  );
}

/**
 * Track the rendered width of the grid container so we can pick a layout
 * variant responsively. Returns `[ref, width]` — attach the ref to the
 * element whose width should drive the layout decision.
 */
function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Seed with current width so first paint isn't always 0 → wrong layout.
    setWidth(el.getBoundingClientRect().width);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width] as const;
}

export default function PreviewGrid(props: PreviewGridProps) {
  const { panels } = props;
  const [containerRef, containerWidth] = useContainerWidth();

  // Always wrap in the measuring container so width is tracked across renders.
  const wrap = (children: React.ReactNode) => (
    <div ref={containerRef} className="h-full w-full">
      {children}
    </div>
  );

  if (panels.length === 0) return null;

  if (panels.length === 1) {
    return wrap(renderPanel(panels[0], props));
  }

  if (panels.length === 2) {
    return wrap(
      <PanelGroup direction="horizontal" className="h-full">
        <Panel defaultSize={50} minSize={25}>{renderPanel(panels[0], props)}</Panel>
        <Handle direction="h" />
        <Panel defaultSize={50} minSize={25}>{renderPanel(panels[1], props)}</Panel>
      </PanelGroup>
    );
  }

  if (panels.length === 3) {
    // Responsive: wide canvases get a single horizontal row; narrower
    // ones fall back to the L-shape (1 left + 2 stacked right) so each
    // panel still has enough width to render a phone mock cleanly.
    if (containerWidth >= BREAKPOINT_3UP_ROW) {
      return wrap(
        <PanelGroup direction="horizontal" className="h-full">
          <Panel defaultSize={34} minSize={20}>{renderPanel(panels[0], props)}</Panel>
          <Handle direction="h" />
          <Panel defaultSize={33} minSize={20}>{renderPanel(panels[1], props)}</Panel>
          <Handle direction="h" />
          <Panel defaultSize={33} minSize={20}>{renderPanel(panels[2], props)}</Panel>
        </PanelGroup>
      );
    }
    return wrap(
      <PanelGroup direction="horizontal" className="h-full">
        <Panel defaultSize={55} minSize={25}>{renderPanel(panels[0], props)}</Panel>
        <Handle direction="h" />
        <Panel defaultSize={45} minSize={25}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={50} minSize={25}>{renderPanel(panels[1], props)}</Panel>
            <Handle direction="v" />
            <Panel defaultSize={50} minSize={25}>{renderPanel(panels[2], props)}</Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    );
  }

  // 4 panels — wide canvases get a single row; otherwise 2×2.
  if (containerWidth >= BREAKPOINT_4UP_ROW) {
    return wrap(
      <PanelGroup direction="horizontal" className="h-full">
        <Panel defaultSize={25} minSize={18}>{renderPanel(panels[0], props)}</Panel>
        <Handle direction="h" />
        <Panel defaultSize={25} minSize={18}>{renderPanel(panels[1], props)}</Panel>
        <Handle direction="h" />
        <Panel defaultSize={25} minSize={18}>{renderPanel(panels[2], props)}</Panel>
        <Handle direction="h" />
        <Panel defaultSize={25} minSize={18}>{renderPanel(panels[3], props)}</Panel>
      </PanelGroup>
    );
  }

  return wrap(
    <PanelGroup direction="vertical" className="h-full">
      <Panel defaultSize={50} minSize={25}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={50} minSize={25}>{renderPanel(panels[0], props)}</Panel>
          <Handle direction="h" />
          <Panel defaultSize={50} minSize={25}>{renderPanel(panels[1], props)}</Panel>
        </PanelGroup>
      </Panel>
      <Handle direction="v" />
      <Panel defaultSize={50} minSize={25}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={50} minSize={25}>{renderPanel(panels[2], props)}</Panel>
          <Handle direction="h" />
          <Panel defaultSize={50} minSize={25}>{renderPanel(panels[3], props)}</Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
}
