export class RecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording = false;

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

  async startRecording(
    videoStream: MediaStream,
    audioStream: MediaStream | null = null
  ) {
    try {
      if (!videoStream) {
        throw new Error('No video stream available for recording');
      }

      // Reset state
      await this.stopRecording();
      this.recordedChunks = [];

      // Create a new MediaStream for combined output
      const combinedStream = new MediaStream();

      // Add all video tracks
      videoStream.getVideoTracks().forEach((track) => {
        console.log('Adding video track:', track.label, track.getSettings());
        combinedStream.addTrack(track);
      });

      // Add all audio tracks if available
      if (audioStream && audioStream.getAudioTracks().length > 0) {
        audioStream.getAudioTracks().forEach((track) => {
          console.log('Adding audio track:', track.label, track.getSettings());
          combinedStream.addTrack(track);
        });
      }

      const mimeType = this.getSupportedMimeType();
      console.log('Creating MediaRecorder:', {
        tracks: {
          video: combinedStream.getVideoTracks().length,
          audio: combinedStream.getAudioTracks().length,
        },
        mimeType,
      });

      // Create MediaRecorder with optimal settings
      this.mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 5000000, // 5 Mbps for better compatibility
        audioBitsPerSecond: 128000, // 128 kbps is standard for audio
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
  }

  stopRecording(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.cleanup();
        resolve();
        return;
      }

      this.mediaRecorder.onstop = () => {
        this.cleanup();
        resolve();
      };

      // Request final data chunk and stop
      this.mediaRecorder.requestData();
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
      console.log('Recording stopped');
    });
  }

  async saveRecording(): Promise<string | null> {
    try {
      if (this.recordedChunks.length === 0) {
        throw new Error('No recording data available');
      }

      // Create blob with proper MIME type
      const mimeType = this.getSupportedMimeType();
      const blob = new Blob(this.recordedChunks, { type: mimeType });

      console.log('Created recording blob:', {
        size: blob.size,
        type: blob.type,
        chunks: this.recordedChunks.length,
      });

      // Convert blob to array buffer
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Send to main process for ffmpeg processing and saving
      const result = await window.ipcRenderer.invoke('save-recording', {
        buffer: Array.from(uint8Array),
        mimeType, // Pass mime type to main process
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      this.recordedChunks = [];
      return result.filePath;
    } catch (error) {
      console.error('Error saving recording:', error);
      return null;
    }
  }
}
