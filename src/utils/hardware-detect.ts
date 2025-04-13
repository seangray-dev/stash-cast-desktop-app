import { spawn } from 'child_process';
import type { HardwareAcceleration } from '../services/ffmpeg/types';

export async function detectHardwareAcceleration(): Promise<HardwareAcceleration> {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', ['-encoders']);
    let output = '';

    ffmpeg.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffmpeg.stderr.on('data', (data) => {
      output += data.toString();
    });

    ffmpeg.on('close', () => {
      // Check for available hardware encoders
      if (
        process.platform === 'darwin' &&
        output.includes('h264_videotoolbox')
      ) {
        resolve({
          type: 'videotoolbox',
          available: true,
          name: 'Apple VideoToolbox',
        });
      } else if (output.includes('h264_nvenc')) {
        resolve({
          type: 'nvenc',
          available: true,
          name: 'NVIDIA NVENC',
        });
      } else if (output.includes('h264_qsv')) {
        resolve({
          type: 'qsv',
          available: true,
          name: 'Intel Quick Sync',
        });
      } else if (output.includes('h264_amf')) {
        resolve({
          type: 'amf',
          available: true,
          name: 'AMD AMF',
        });
      } else {
        resolve({
          type: 'none',
          available: false,
          name: 'Software Encoding',
        });
      }
    });

    // Fallback in case of error
    ffmpeg.on('error', () => {
      resolve({
        type: 'none',
        available: false,
        name: 'Software Encoding',
      });
    });
  });
}

export function getEncoderSettings(hwAccel: HardwareAcceleration): string[] {
  switch (hwAccel.type) {
    case 'videotoolbox':
      return ['-c:v', 'h264_videotoolbox'];
    case 'nvenc':
      return ['-c:v', 'h264_nvenc', '-preset', 'p7', '-tune', 'hq'];
    case 'qsv':
      return ['-c:v', 'h264_qsv', '-preset', 'veryslow'];
    case 'amf':
      return ['-c:v', 'h264_amf', '-quality', 'quality'];
    default:
      return ['-c:v', 'libx264']; // Software encoding
  }
}
