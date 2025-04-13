export interface VideoQualitySettings {
  width: number;
  height: number;
  videoBitrate: string;
  audioBitrate: string;
  crf: number;
}

export const VIDEO_QUALITY_PRESETS: Record<string, VideoQualitySettings> = {
  '2160p': {
    width: 3840,
    height: 2160,
    videoBitrate: '45M',
    audioBitrate: '384k',
    crf: 18,
  },
  '1440p': {
    width: 2560,
    height: 1440,
    videoBitrate: '16M',
    audioBitrate: '256k',
    crf: 20,
  },
  '1080p': {
    width: 1920,
    height: 1080,
    videoBitrate: '8M',
    audioBitrate: '192k',
    crf: 22,
  },
  '720p': {
    width: 1280,
    height: 720,
    videoBitrate: '5M',
    audioBitrate: '128k',
    crf: 23,
  },
  '480p': {
    width: 854,
    height: 480,
    videoBitrate: '2.5M',
    audioBitrate: '96k',
    crf: 25,
  },
};
