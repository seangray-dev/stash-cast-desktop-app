export interface HardwareAcceleration {
  type: 'videotoolbox' | 'nvenc' | 'qsv' | 'amf' | 'none';
  available: boolean;
  name: string;
}

export interface FFmpegSettings {
  useHardwareAcceleration: boolean;
  preset:
    | 'ultrafast'
    | 'superfast'
    | 'veryfast'
    | 'faster'
    | 'fast'
    | 'medium'
    | 'slow'
    | 'slower'
    | 'veryslow';
  crf: number; // 0-51, lower means better quality
  audioQuality: number; // 0-9, lower means better quality
  maxBitrate?: string; // e.g., '5M'
  quality?: '2160p' | '1440p' | '1080p' | '720p' | '480p'; // Video quality preset
  width?: number; // Custom width if not using preset
  height?: number; // Custom height if not using preset
  videoBitrate?: string; // Custom video bitrate if not using preset
  audioBitrate?: string; // Custom audio bitrate if not using preset
  maintainAspectRatio?: boolean; // Whether to maintain aspect ratio when scaling
}

export interface ConversionProgress {
  percent: number;
  frame: number;
  fps: number;
  time: string;
  bitrate: string;
  size: string;
}

export interface ConversionResult {
  success: boolean;
  outputPath?: string;
  error?: string;
  duration: number;
  size: number;
}
