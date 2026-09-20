// Figma Plugin Code - runs in Figma's sandbox with API access

// Show the plugin UI
figma.showUI(__html__, {
  width: 1000,
  height: 700,
  themeColors: true
});

// Message types
type PluginMessage =
  | { type: 'GET_FRAMES' }
  | { type: 'EXPORT_FRAME'; frameId: string; deviceType: string; scale?: number; panelId?: string }
  | { type: 'REFRESH_FRAME'; frameId: string; deviceType: string; scale?: number; panelId?: string }
  | { type: 'GET_SELECTION' }
  | { type: 'RESIZE'; width: number; height: number };

type UIMessage =
  | { type: 'FRAMES_LIST'; frames: FrameData[] }
  | { type: 'FRAME_IMAGE'; frameId: string; image: string; width: number; height: number; name: string; deviceType: string; panelId?: string }
  | { type: 'SELECTION_CHANGED'; selectedFrames: FrameData[] }
  | { type: 'ERROR'; message: string };

interface FrameData {
  id: string;
  name: string;
  width: number;
  height: number;
}

// Listen for messages from UI
figma.ui.onmessage = async (msg: PluginMessage) => {
  try {
    if (msg.type === 'GET_FRAMES') {
      await getFramesFromPage();
    }

    if (msg.type === 'EXPORT_FRAME' || msg.type === 'REFRESH_FRAME') {
      await exportFrame(msg.frameId, msg.deviceType, msg.scale || 2, msg.panelId);
    }

    if (msg.type === 'RESIZE') {
      // MIN_W is set so the toolbar (Brand + center cluster + right controls)
      // never gets compressed enough to wrap or overflow.
      const MIN_W = 1000, MAX_W = 1800, MIN_H = 500, MAX_H = 1100;
      figma.ui.resize(
        Math.round(Math.min(MAX_W, Math.max(MIN_W, msg.width))),
        Math.round(Math.min(MAX_H, Math.max(MIN_H, msg.height)))
      );
    }

    if (msg.type === 'GET_SELECTION') {
      figma.ui.postMessage({
        type: 'SELECTION_CHANGED',
        selectedFrames: getSelectedFrames()
      } as UIMessage);
    }
  } catch (error) {
    figma.ui.postMessage({
      type: 'ERROR',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    } as UIMessage);
  }
};

// Get all frames from the current page
async function getFramesFromPage() {
  const frames = figma.currentPage.findAll(node => {
    return node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE';
  });

  const frameData: FrameData[] = frames.map(frame => ({
    id: frame.id,
    name: frame.name,
    width: (frame as FrameNode).width,
    height: (frame as FrameNode).height,
  }));

  figma.ui.postMessage({
    type: 'FRAMES_LIST',
    frames: frameData
  } as UIMessage);
}

// Export a frame as PNG image
async function exportFrame(frameId: string, deviceType: string, scale: number = 2, panelId?: string) {
  const node = await figma.getNodeByIdAsync(frameId);

  if (!node) {
    throw new Error('Frame not found');
  }

  if (node.type !== 'FRAME' && node.type !== 'COMPONENT' && node.type !== 'INSTANCE') {
    throw new Error('Selected node is not a frame');
  }

  // Export as PNG with specified scale
  const imageBytes = await node.exportAsync({
    format: 'PNG',
    constraint: {
      type: 'SCALE',
      value: scale
    }
  });

  // Convert to base64
  const base64 = figma.base64Encode(imageBytes);

  // Send back to UI
  figma.ui.postMessage({
    type: 'FRAME_IMAGE',
    frameId: frameId,
    image: base64,
    width: node.width,
    height: node.height,
    name: node.name,
    deviceType: deviceType,
    panelId: panelId
  } as UIMessage);
}

function getSelectedFrames() {
  const selection = figma.currentPage.selection;
  const selectedFrames: FrameData[] = [];
  
  for (const node of selection) {
    if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
      selectedFrames.push({
        id: node.id,
        name: node.name,
        width: node.width,
        height: node.height
      });
    }
  }
  return selectedFrames;
}

figma.on('selectionchange', () => {
  try {
    figma.ui.postMessage({
      type: 'SELECTION_CHANGED',
      selectedFrames: getSelectedFrames()
    } as UIMessage);
  } catch (err) {
    console.error(err);
  }
});

// Initial load - get frames and selection automatically
getFramesFromPage();
figma.ui.postMessage({
  type: 'SELECTION_CHANGED',
  selectedFrames: getSelectedFrames()
} as UIMessage);
