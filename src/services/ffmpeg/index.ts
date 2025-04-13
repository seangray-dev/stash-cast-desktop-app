import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  detectHardwareAcceleration,
  getEncoderSettings,
} from '../../utils/hardware-detect';
import { VIDEO_QUALITY_PRESETS } from './quality-presets';
import type {
  ConversionProgress,
  ConversionResult,
  FFmpegSettings,
  HardwareAcceleration,
} from './types';

export class FFmpegService {
  private hwAccel: HardwareAcceleration | null = null;
  private defaultSettings: FFmpegSettings = {
    useHardwareAcceleration: true,
    preset: 'medium',
    crf: 23,
    audioQuality: 3,
    maxBitrate: '5M',
    quality: '1080p', // Default to 1080p
    maintainAspectRatio: true,
  };

  constructor() {
    this.initializeHardwareAcceleration();
  }

  private async initializeHardwareAcceleration() {
    this.hwAccel = await detectHardwareAcceleration();
    console.log('Hardware acceleration:', this.hwAccel);
  }

  private getFFmpegArgs(
    inputPath: string,
    outputPath: string,
    settings: FFmpegSettings
  ): string[] {
    const args = [
      '-y', // Overwrite output file
      '-i',
      inputPath, // Input file
    ];

    // Add hardware acceleration if available and enabled
    if (settings.useHardwareAcceleration && this.hwAccel?.available) {
      args.push(...getEncoderSettings(this.hwAccel));
    } else {
      args.push('-c:v', 'libx264'); // Software encoding
    }

    // Apply quality preset if specified
    if (settings.quality && VIDEO_QUALITY_PRESETS[settings.quality]) {
      const preset = VIDEO_QUALITY_PRESETS[settings.quality];
      args.push(
        '-vf',
        `scale=${preset.width}:${preset.height}${settings.maintainAspectRatio ? ':force_original_aspect_ratio=decrease' : ''}`,
        '-b:v',
        preset.videoBitrate,
        '-b:a',
        preset.audioBitrate,
        '-crf',
        preset.crf.toString()
      );
    } else if (settings.width && settings.height) {
      // Use custom dimensions if specified
      args.push(
        '-vf',
        `scale=${settings.width}:${settings.height}${settings.maintainAspectRatio ? ':force_original_aspect_ratio=decrease' : ''}`
      );
    }

    // Add encoding settings
    args.push(
      '-preset',
      settings.preset,
      // Audio settings
      '-c:a',
      'aac',
      '-q:a',
      settings.audioQuality.toString(),
      '-ar',
      '48000', // Audio sample rate
      '-ac',
      '2', // Stereo audio
      // Additional optimizations
      '-movflags',
      '+faststart',
      '-pix_fmt',
      'yuv420p'
    );

    // Add max bitrate if specified and not using quality preset
    if (settings.maxBitrate && !settings.quality) {
      args.push(
        '-maxrate',
        settings.maxBitrate,
        '-bufsize',
        settings.maxBitrate
      );
    }

    // Add custom bitrates if specified and not using quality preset
    if (!settings.quality) {
      if (settings.videoBitrate) {
        args.push('-b:v', settings.videoBitrate);
      }
      if (settings.audioBitrate) {
        args.push('-b:a', settings.audioBitrate);
      }
    }

    args.push(outputPath);
    return args;
  }

  public async convertVideo(
    inputBuffer: Uint8Array,
    outputPath: string,
    settings: Partial<FFmpegSettings> = {},
    onProgress?: (progress: ConversionProgress) => void
  ): Promise<ConversionResult> {
    try {
      // Create temporary input file
      const tempInput = join(tmpdir(), `temp-${Date.now()}.webm`);
      await fs.writeFile(tempInput, Buffer.from(inputBuffer));

      // Merge settings with defaults
      const finalSettings: FFmpegSettings = {
        ...this.defaultSettings,
        ...settings,
      };

      return new Promise((resolve, reject) => {
        const args = this.getFFmpegArgs(tempInput, outputPath, finalSettings);
        console.log('FFmpeg arguments:', args);

        const ffmpeg = spawn('ffmpeg', args);
        let duration = 0;
        let errorLog = '';

        ffmpeg.stderr.on('data', (data) => {
          const message = data.toString();

          // Extract duration if not already found
          if (!duration) {
            const match = message.match(/Duration: (\d{2}):(\d{2}):(\d{2})/);
            if (match) {
              duration =
                parseInt(match[1]) * 3600 +
                parseInt(match[2]) * 60 +
                parseInt(match[3]);
            }
          }

          // Parse progress
          const timeMatch = message.match(/time=(\d{2}):(\d{2}):(\d{2})/);
          if (timeMatch && duration && onProgress) {
            const time =
              parseInt(timeMatch[1]) * 3600 +
              parseInt(timeMatch[2]) * 60 +
              parseInt(timeMatch[3]);
            const progress: ConversionProgress = {
              percent: (time / duration) * 100,
              frame: 0, // TODO: Parse frame info
              fps: 0, // TODO: Parse FPS
              time: `${timeMatch[1]}:${timeMatch[2]}:${timeMatch[3]}`,
              bitrate: '0', // TODO: Parse bitrate
              size: '0', // TODO: Parse size
            };
            onProgress(progress);
          }

          errorLog += message;
        });

        ffmpeg.on('close', async (code) => {
          try {
            // Clean up temp file
            await fs.unlink(tempInput);

            if (code === 0) {
              const fileInfo = await fs.stat(outputPath);
              resolve({
                success: true,
                outputPath,
                duration,
                size: fileInfo.size,
              });
            } else {
              reject(new Error(`FFmpeg conversion failed: ${errorLog}`));
            }
          } catch (error) {
            reject(error);
          }
        });

        ffmpeg.on('error', (error) => {
          fs.unlink(tempInput).catch(console.error);
          reject(error);
        });
      });
    } catch (error) {
      throw new Error(
        `Failed to convert video: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  public getHardwareAcceleration(): HardwareAcceleration | null {
    return this.hwAccel;
  }

  public async updateSettings(settings: Partial<FFmpegSettings>) {
    this.defaultSettings = {
      ...this.defaultSettings,
      ...settings,
    };
  }
}
