import { X, RefreshCw } from 'lucide-react';
import { forwardRef, UIEvent } from 'react';
import DeviceFrame from './DeviceFrame';
import DeviceSelect from './DeviceSelect';

interface PreviewPanelProps {
  frameId: string;
  imageData: string;
  frameName: string;
  deviceType: string;
  width: number;
  height: number;
  onRemove?: () => void;
  onRefresh?: () => void;
  onChangeDevice?: (deviceType: string) => void;
  onScroll?: (event: UIEvent<HTMLDivElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * One preview panel — sits inside the PreviewGrid.
 * Header layout (mirrors the Figma reference 162:2676):
 *   [ name · WxH ]                [ device chip | refresh | close ]
 */
const PreviewPanel = forwardRef<HTMLDivElement, PreviewPanelProps>(
  (
    {
      imageData, frameName, deviceType, width, height,
      onRemove, onRefresh, onChangeDevice, onScroll, onMouseEnter, onMouseLeave,
    },
    ref
  ) => {
    return (
      <div className="flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden">

        {/* Header — 36px */}
        <div className="flex items-center justify-between gap-2 px-3 h-9 border-b border-border shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[12px] font-medium text-foreground truncate leading-none">
              {frameName}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono leading-none shrink-0">
              {Math.round(width)}×{Math.round(height)}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onChangeDevice && (
              <DeviceSelect
                value={deviceType}
                onChange={onChangeDevice}
                triggerClassName="min-w-[140px] !h-7 !text-[11px] !pl-2.5 !pr-1.5"
              />
            )}

            {onRefresh && (
              <button
                onClick={onRefresh}
                title="Refresh"
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors duration-100 group"
              >
                <RefreshCw size={12} className="text-muted-foreground group-hover:text-primary transition-colors duration-100" />
              </button>
            )}
            {onRemove && (
              <button
                onClick={onRemove}
                title="Remove"
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors duration-100 group"
              >
                <X size={12} className="text-muted-foreground group-hover:text-destructive transition-colors duration-100" />
              </button>
            )}
          </div>
        </div>

        {/* Stage */}
        <div className="flex-1 min-h-0 w-full" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <DeviceFrame deviceType={deviceType} scrollRef={ref} onScroll={onScroll}>
            <img
              src={`data:image/png;base64,${imageData}`}
              alt={frameName}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </DeviceFrame>
        </div>

      </div>
    );
  }
);

PreviewPanel.displayName = 'PreviewPanel';
export default PreviewPanel;
