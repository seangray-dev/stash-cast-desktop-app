import useMediaConfigStore from '@/stores/media-config-store';
import { useEffect, useRef } from 'react';

export default function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isCameraEnabled, selectedScreen, cameraStream } =
    useMediaConfigStore();

  // Show/hide window and handle cleanup
  useEffect(() => {
    if (isCameraEnabled) {
      window.ipcRenderer.send('show-camera-window');
    }

    return () => {
      window.ipcRenderer.send('hide-camera-window');
    };
  }, [isCameraEnabled]);

  // Position window relative to selected screen or default position
  useEffect(() => {
    const setWindowPosition = async () => {
      try {
        if (selectedScreen) {
          const { bounds } = await window.ipcRenderer.invoke(
            'get-display-info',
            selectedScreen.display_id
          );
          const x = bounds.x + bounds.width - 340;
          const y = bounds.y + bounds.height - 340;
          window.ipcRenderer.send('set-camera-window-position', { x, y });
        } else {
          const { bounds } = await window.ipcRenderer.invoke(
            'get-primary-display'
          );
          const x = bounds.x + bounds.width - 340;
          const y = bounds.y + bounds.height - 340;
          window.ipcRenderer.send('set-camera-window-position', { x, y });
        }
      } catch (error) {
        console.error('Error setting window position:', error);
      }
    };

    setWindowPosition();
  }, [selectedScreen]);

  // Handle video element stream
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !cameraStream) return;

    videoElement.srcObject = cameraStream;
    videoElement.play().catch(console.error);

    return () => {
      videoElement.srcObject = null;
    };
  }, [cameraStream]);

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
