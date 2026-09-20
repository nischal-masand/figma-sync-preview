import { ReactNode, useRef, useState, useEffect } from 'react';
import { DEVICE_CONFIGS } from '../types';

interface DeviceFrameProps {
  deviceType: string;
  children: ReactNode;
  scrollRef?: React.Ref<HTMLDivElement>;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export default function DeviceFrame({ deviceType, children, scrollRef, onScroll }: DeviceFrameProps) {
  const config = DEVICE_CONFIGS[deviceType];
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!config) {
    return (
      <div 
        ref={scrollRef as any} 
        onScroll={onScroll} 
        className="size-full overflow-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--muted) var(--background)',
        }}
      >
        {children}
      </div>
    );
  }

  // For "Actual Size", just show a scrollable frame without scaling
  if (deviceType === 'Actual Size') {
    return (
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div 
          ref={scrollRef as any}
          onScroll={onScroll}
          className="max-w-full max-h-full overflow-auto border border-border rounded-lg shadow-sm bg-background"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--muted) var(--background)',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  const deviceOuterWidth = config.width + 2 * config.bezelWidth;
  const deviceOuterHeight = config.height + 2 * config.bezelWidth;

  const padding = 48; // Padding inside the panel
  const maxW = dimensions.width - padding;
  const maxH = dimensions.height - padding;
  
  let scale = 1;
  if (maxW > 0 && maxH > 0) {
    // Fit within available space, but never upscale beyond the device's actual size.
    scale = Math.min(1, maxW / deviceOuterWidth, maxH / deviceOuterHeight);
  }

  return (
    <div 
      ref={containerRef} 
      className="relative flex items-center justify-center w-full h-full overflow-hidden bg-background/50"
    >
      {/* Scaled Device Mockup */}
      <div
        className="relative bg-[#0d0d15] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 shrink-0"
        style={{
          width: `${deviceOuterWidth}px`,
          height: `${deviceOuterHeight}px`,
          borderRadius: config.borderRadius,
          padding: `${config.bezelWidth}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Dynamic Island (for iPhone 14 Pro / Pro Max) */}
        {config.hasNotch && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-end pr-5 shadow-inner">
            {/* Camera dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#111122] border border-white/5 shadow-inner" />
          </div>
        )}

        {/* Screen Area (Scrollable) */}
        <div
          ref={scrollRef as any}
          onScroll={onScroll}
          className="relative overflow-y-auto overflow-x-hidden bg-[#161622] size-full select-none"
          style={{
            borderRadius: `calc(${config.borderRadius} - ${config.bezelWidth}px)`,
            scrollbarWidth: 'none', // Hide scrollbar for cleaner device look
            msOverflowStyle: 'none',
          }}
        >
          {/* Custom style to hide scrollbar in Webkit browsers */}
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {children}
        </div>
      </div>
    </div>
  );
}
