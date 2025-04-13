import { parentPort } from 'worker_threads';
import { FFmpegService } from '../services/ffmpeg';
import type {
  ConversionProgress,
  FFmpegSettings,
} from '../services/ffmpeg/types';

const ffmpegService = new FFmpegService();

if (parentPort) {
  parentPort.on(
    'message',
    async (message: {
      type: string;
      data: {
        buffer: Uint8Array;
        outputPath: string;
        settings?: Partial<FFmpegSettings>;
      };
    }) => {
      try {
        switch (message.type) {
          case 'convert': {
            const result = await ffmpegService.convertVideo(
              message.data.buffer,
              message.data.outputPath,
              message.data.settings,
              (progress: ConversionProgress) => {
                parentPort?.postMessage({
                  type: 'progress',
                  data: progress,
                });
              }
            );

            parentPort?.postMessage({
              type: 'complete',
              data: result,
            });
            break;
          }

          case 'getHardwareAcceleration': {
            const hwAccel = ffmpegService.getHardwareAcceleration();
            parentPort?.postMessage({
              type: 'hardwareAcceleration',
              data: hwAccel,
            });
            break;
          }

          case 'updateSettings': {
            await ffmpegService.updateSettings(message.data.settings || {});
            parentPort?.postMessage({
              type: 'settingsUpdated',
              data: null,
            });
            break;
          }

          default:
            throw new Error(`Unknown message type: ${message.type}`);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          parentPort?.postMessage({
            type: 'error',
            data: error.message,
          });
        } else {
          parentPort?.postMessage({
            type: 'error',
            data: 'Unknown error',
          });
        }
      }
    }
  );
}
