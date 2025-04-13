import type {
  RecordingOptions,
  RecordingState,
  RecordingStats,
  SaveOptions,
  SaveResult,
} from './types';

export class RecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording = false;
  private startTime: number = 0;
  private currentDuration: number = 0;
  private durationInterval: number | null = null;

  private getSupportedMimeType(): string {
    const types = [
      'video/webm;codecs=vp8,opus', // Most compatible WebM format
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log('Using MIME type:', type);
        return type;
      }
    }
    throw new Error('No supported mime type found for MediaRecorder');
  }

  async startRecording(options: RecordingOptions): Promise<boolean> {
    try {
      if (!options.videoStream) {
        throw new Error('No video stream available for recording');
      }

      // Reset state
      await this.stopRecording();
      this.recordedChunks = [];

      // Create a new MediaStream for combined output
      const combinedStream = new MediaStream();

      // Add all video tracks
      options.videoStream.getVideoTracks().forEach((track) => {
        console.log('Adding video track:', track.label, track.getSettings());
        combinedStream.addTrack(track);
      });

      // Add all audio tracks if available
      const audioStream = options.audioStream;
      if (audioStream && audioStream.getAudioTracks().length > 0) {
        audioStream.getAudioTracks().forEach((track) => {
          console.log('Adding audio track:', track.label, track.getSettings());
          combinedStream.addTrack(track);
        });
      }

      const mimeType = this.getSupportedMimeType();
      const tracks = {
        video: combinedStream.getVideoTracks().length,
        audio: combinedStream.getAudioTracks().length,
      };

      console.log('Creating MediaRecorder:', { tracks, mimeType });

      // Create MediaRecorder with optimal settings
      this.mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: options.videoBitsPerSecond || 5000000, // 5 Mbps for better compatibility
        audioBitsPerSecond: options.audioBitsPerSecond || 128000, // 128 kbps is standard for audio
      });

      // Handle data available event
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          console.log('Received data chunk:', event.data.size, 'bytes');
          this.recordedChunks.push(event.data);
        }
      };

      // Start recording with smaller chunk size for better handling
      this.mediaRecorder.start(1000);
      this.isRecording = true;
      this.startTime = Date.now();
      this.currentDuration = 0;

      // Update duration every second
      this.durationInterval = window.setInterval(() => {
        this.currentDuration = Math.floor((Date.now() - this.startTime) / 1000);
      }, 1000);

      console.log('Recording started');
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      this.cleanup();
      return false;
    }
  }

  private cleanup() {
    this.recordedChunks = [];
    this.isRecording = false;
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
  }

  private resetState() {
    this.isRecording = false;
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
  }

  stopRecording(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.resetState();
        resolve();
        return;
      }

      this.mediaRecorder.onstop = () => {
        // Calculate final duration
        if (this.startTime > 0) {
          this.currentDuration = Math.floor(
            (Date.now() - this.startTime) / 1000
          );
        }
        this.resetState();
        resolve();
      };

      // Request final data chunk and stop
      this.mediaRecorder.requestData();
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
      console.log('Recording stopped');
    });
  }

  async saveRecording(options: SaveOptions = {}): Promise<SaveResult> {
    try {
      if (this.recordedChunks.length === 0) {
        throw new Error('No recording data available');
      }

      // Create blob with proper MIME type
      const mimeType = this.getSupportedMimeType();
      const blob = new Blob(this.recordedChunks, { type: mimeType });

      const stats: RecordingStats = {
        size: blob.size,
        type: blob.type,
        chunks: this.recordedChunks.length,
        tracks: {
          video: this.mediaRecorder?.stream.getVideoTracks().length ?? 0,
          audio: this.mediaRecorder?.stream.getAudioTracks().length ?? 0,
        },
      };

      console.log('Created recording blob:', stats);

      // Convert blob to array buffer
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Send to main process for ffmpeg processing and saving
      const result = await window.ipcRenderer.invoke('save-recording', {
        buffer: Array.from(uint8Array),
        mimeType,
        options,
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error,
        };
      }

      this.recordedChunks = [];
      return {
        success: true,
        filePath: result.filePath,
      };
    } catch (error) {
      console.error('Error saving recording:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  getState(): RecordingState {
    return {
      isRecording: this.isRecording,
      duration: this.currentDuration,
      chunks: this.recordedChunks,
    };
  }
}
