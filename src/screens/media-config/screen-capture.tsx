import { cn } from '@/lib/utils';
import useMediaConfigStore from '@/stores/media-config-store';
import { useEffect, useRef } from 'react';

export default function ScreenCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { screenStream, cameraStream, isDisplayEnabled, isCameraEnabled } =
    useMediaConfigStore();

  // Update video source when streams change
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const playVideo = async () => {
      try {
        await videoElement.play();
      } catch (error) {
        console.error('Error starting video playback:', error);
      }
    };

    // If display is enabled and we have screen stream, show that
    if (isDisplayEnabled && screenStream) {
      videoElement.srcObject = screenStream;
      playVideo();
    }
    // If no display but camera is enabled, show camera
    else if (!isDisplayEnabled && isCameraEnabled && cameraStream) {
      videoElement.srcObject = cameraStream;
      playVideo();
    }
    // Otherwise clear the video
    else {
      videoElement.srcObject = null;
    }

    return () => {
      if (videoElement.srcObject) {
        videoElement.srcObject = null;
      }
    };
  }, [screenStream, cameraStream, isDisplayEnabled, isCameraEnabled]);

  return (
    <div className='flex flex-col'>
      <div
        className={cn(
          'aspect-video w-full rounded-lg border bg-muted overflow-hidden',
          {
            'bg-muted': !screenStream && !cameraStream,
          }
        )}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className='h-full w-full rounded-lg object-contain'
        />
      </div>
    </div>
  );
}
