// Message types for communication between plugin code and UI

export type PluginMessage =
  | { type: 'GET_FRAMES' }
  | { type: 'EXPORT_FRAME'; frameId: string; deviceType: string; scale?: number; panelId?: string }
  | { type: 'REFRESH_FRAME'; frameId: string; deviceType: string; scale?: number; panelId?: string }
  | { type: 'GET_SELECTION' }
  | { type: 'RESIZE'; width: number; height: number };

export type UIMessage =
  | { type: 'FRAMES_LIST'; frames: FrameData[] }
  | { type: 'FRAME_IMAGE'; frameId: string; image: string; width: number; height: number; name: string; deviceType: string; panelId?: string }
  | { type: 'SELECTION_CHANGED'; selectedFrames: FrameData[] }
  | { type: 'ERROR'; message: string };

export interface FrameData {
  id: string;
  name: string;
  width: number;
  height: number;
}

export interface Panel {
  id: string;
  frameId: string;
  imageData: string; // base64
  frameName: string;
  deviceType: string;
  width: number;
  height: number;
}

export type DeviceGroup = 'Phone' | 'Tablet' | 'Android' | 'Other';

export interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  bezelWidth: number;
  borderRadius: string;
  hasNotch?: boolean;
  group: DeviceGroup;
}

export const DEVICE_CONFIGS: Record<string, DeviceConfig> = {
  'Actual Size': {
    name: 'Actual Size',
    width: 0, // Will use frame's actual dimensions
    height: 0,
    bezelWidth: 8,
    borderRadius: '0.5rem',
    hasNotch: false,
    group: 'Other',
  },

  // Phones
  'iPhone 17': {
    name: 'iPhone 17',
    width: 402,
    height: 874,
    bezelWidth: 12,
    borderRadius: '3rem',
    hasNotch: true,
    group: 'Phone',
  },
  'iPhone 16 & 17 Pro': {
    name: 'iPhone 16 & 17 Pro',
    width: 402,
    height: 874,
    bezelWidth: 12,
    borderRadius: '3rem',
    hasNotch: true,
    group: 'Phone',
  },
  'iPhone 16': {
    name: 'iPhone 16',
    width: 393,
    height: 852,
    bezelWidth: 12,
    borderRadius: '3rem',
    hasNotch: true,
    group: 'Phone',
  },
  'iPhone 16 & 17 Pro Max': {
    name: 'iPhone 16 & 17 Pro Max',
    width: 440,
    height: 956,
    bezelWidth: 12,
    borderRadius: '3rem',
    hasNotch: true,
    group: 'Phone',
  },
  'iPhone 16 Plus': {
    name: 'iPhone 16 Plus',
    width: 430,
    height: 932,
    bezelWidth: 12,
    borderRadius: '3rem',
    hasNotch: true,
    group: 'Phone',
  },

  // Tablets
  'iPad Pro 11"': {
    name: 'iPad Pro 11"',
    width: 834,
    height: 1194,
    bezelWidth: 14,
    borderRadius: '1.75rem',
    hasNotch: false,
    group: 'Tablet',
  },
  'iPad Pro 12.9"': {
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    bezelWidth: 14,
    borderRadius: '1.75rem',
    hasNotch: false,
    group: 'Tablet',
  },

  // Android
  'Android Large': {
    name: 'Android Large',
    width: 360,
    height: 800,
    bezelWidth: 10,
    borderRadius: '2rem',
    hasNotch: false,
    group: 'Android',
  },
};
