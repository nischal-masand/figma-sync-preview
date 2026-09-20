// plugin/code.ts
figma.showUI(__html__, {
  width: 1e3,
  height: 700,
  themeColors: true
});
figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === "GET_FRAMES") {
      await getFramesFromPage();
    }
    if (msg.type === "EXPORT_FRAME" || msg.type === "REFRESH_FRAME") {
      await exportFrame(msg.frameId, msg.deviceType, msg.scale || 2, msg.panelId);
    }
    if (msg.type === "RESIZE") {
      const MIN_W = 1e3, MAX_W = 1800, MIN_H = 500, MAX_H = 1100;
      figma.ui.resize(
        Math.round(Math.min(MAX_W, Math.max(MIN_W, msg.width))),
        Math.round(Math.min(MAX_H, Math.max(MIN_H, msg.height)))
      );
    }
    if (msg.type === "GET_SELECTION") {
      figma.ui.postMessage({
        type: "SELECTION_CHANGED",
        selectedFrames: getSelectedFrames()
      });
    }
  } catch (error) {
    figma.ui.postMessage({
      type: "ERROR",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
};
async function getFramesFromPage() {
  const frames = figma.currentPage.findAll((node) => {
    return node.type === "FRAME" || node.type === "COMPONENT" || node.type === "INSTANCE";
  });
  const frameData = frames.map((frame) => ({
    id: frame.id,
    name: frame.name,
    width: frame.width,
    height: frame.height
  }));
  figma.ui.postMessage({
    type: "FRAMES_LIST",
    frames: frameData
  });
}
async function exportFrame(frameId, deviceType, scale = 2, panelId) {
  const node = await figma.getNodeByIdAsync(frameId);
  if (!node) {
    throw new Error("Frame not found");
  }
  if (node.type !== "FRAME" && node.type !== "COMPONENT" && node.type !== "INSTANCE") {
    throw new Error("Selected node is not a frame");
  }
  const imageBytes = await node.exportAsync({
    format: "PNG",
    constraint: {
      type: "SCALE",
      value: scale
    }
  });
  const base64 = figma.base64Encode(imageBytes);
  figma.ui.postMessage({
    type: "FRAME_IMAGE",
    frameId,
    image: base64,
    width: node.width,
    height: node.height,
    name: node.name,
    deviceType,
    panelId
  });
}
function getSelectedFrames() {
  const selection = figma.currentPage.selection;
  const selectedFrames = [];
  for (const node of selection) {
    if (node.type === "FRAME" || node.type === "COMPONENT" || node.type === "INSTANCE") {
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
figma.on("selectionchange", () => {
  try {
    figma.ui.postMessage({
      type: "SELECTION_CHANGED",
      selectedFrames: getSelectedFrames()
    });
  } catch (err) {
    console.error(err);
  }
});
getFramesFromPage();
figma.ui.postMessage({
  type: "SELECTION_CHANGED",
  selectedFrames: getSelectedFrames()
});
