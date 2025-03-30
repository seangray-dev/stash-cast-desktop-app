import { useEffect, useRef, useState } from 'react';
import { useMediaConfig } from '../../providers/media-config-provider';

export default function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { isCameraEnabled, selectedScreen } = useMediaConfig();

  // Position window relative to selected screen
  useEffect(() => {
    if (!selectedScreen) return;

    // Get screen info from electron
    window.ipcRenderer
      .invoke('get-display-info', selectedScreen.display_id)
      .then(({ bounds }) => {
        const x = bounds.x + bounds.width - 340; // 20px padding from right
        const y = bounds.y + bounds.height - 340; // 20px padding from bottom
        window.ipcRenderer.send('set-camera-window-position', { x, y });
      });
  }, [selectedScreen]);

  // Listen for camera stream from main window
  useEffect(() => {
    console.log('Setting up camera stream listener');
    const handleCameraStream = async (
      _event: any,
      { streamId, settings }: { streamId: string; settings: MediaTrackSettings }
    ) => {
      console.log('Received camera stream info:', { streamId, settings });
      try {
        const constraints = {
          video: {
            deviceId: { exact: settings.deviceId },
            width: { ideal: 320 },
            height: { ideal: 320 },
          },
        };
        console.log('Requesting camera stream with constraints:', constraints);
        const newStream =
          await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Created camera stream in preview window');
        setStream(newStream);
      } catch (error) {
        console.error('Error creating camera stream in preview:', error);
      }
    };

    window.ipcRenderer.on('camera-stream-ready', handleCameraStream);
    return () => {
      window.ipcRenderer.removeListener(
        'camera-stream-ready',
        handleCameraStream
      );
    };
  }, []);

  // Handle video element
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      console.log('No video element available');
      return;
    }

    console.log('Setting up video element with stream:', {
      hasStream: !!stream,
    });

    if (stream) {
      console.log('Setting stream to video element');
      videoElement.srcObject = stream;
      videoElement.play().catch(console.error);
    } else {
      console.log('Clearing video source');
      videoElement.srcObject = null;
    }

    return () => {
      if (videoElement.srcObject) {
        videoElement.srcObject = null;
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Show/Hide the window based on state
  useEffect(() => {
    if (isCameraEnabled) {
      console.log('Showing camera window');
      window.ipcRenderer.send('show-camera-window');
    } else {
      console.log('Hiding camera window');
      window.ipcRenderer.send('hide-camera-window');
    }
  }, [isCameraEnabled]);

  return (
    <div className='flex w-screen h-screen items-center justify-center bg-transparent overflow-hidden border-2 border-red-500'>
      <div className='relative w-full h-full drag overflow-hidden'>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className='w-full h-full overflow-hidden'
        />
      </div>
    </div>
  );
}
