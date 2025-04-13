export interface RecordingOptions {
  videoStream: MediaStream;
  audioStream?: MediaStream | null;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
}

export interface RecordingState {
  isRecording: boolean;
  duration: number;
  chunks: Blob[];
}

export interface SaveOptions {
  useHardwareAcceleration?: boolean;
  quality?: '2160p' | '1440p' | '1080p' | '720p' | '480p';
  maintainAspectRatio?: boolean;
  preset?:
    | 'ultrafast'
    | 'superfast'
    | 'veryfast'
    | 'faster'
    | 'fast'
    | 'medium'
    | 'slow'
    | 'slower'
    | 'veryslow';
}

export interface SaveResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export interface RecordingStats {
  size: number;
  type: string;
  chunks: number;
  tracks: {
    video: number;
    audio: number;
  };
}
