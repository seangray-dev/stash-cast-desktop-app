import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { useMediaConfig } from '../../providers/media-config-provider';

export default function ScreenCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { screenStream, cameraStream, isDisplayEnabled, isCameraEnabled } =
    useMediaConfig();

  // Debug logging for state changes
  useEffect(() => {
    console.log('ScreenCapture State:', {
      hasScreenStream: !!screenStream,
      hasCameraStream: !!cameraStream,
      isDisplayEnabled,
      isCameraEnabled,
      screenTracks: screenStream?.getTracks().map((t) => ({
        kind: t.kind,
        enabled: t.enabled,
        id: t.id,
      })),
      cameraTracks: cameraStream?.getTracks().map((t) => ({
        kind: t.kind,
        enabled: t.enabled,
        id: t.id,
      })),
    });
  }, [screenStream, cameraStream, isDisplayEnabled, isCameraEnabled]);

  // Update video source when streams change
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    console.log('ScreenCapture attempting to set stream:', {
      hasVideoRef: !!videoElement,
      hasScreenStream: !!screenStream,
      hasCameraStream: !!cameraStream,
      displayEnabled: isDisplayEnabled,
      cameraEnabled: isCameraEnabled,
    });

    const playVideo = async () => {
      try {
        await videoElement.play();
        console.log('Video playback started successfully');
      } catch (error) {
        console.error('Error starting video playback:', error);
      }
    };

    // If display is enabled and we have screen stream, show that
    if (isDisplayEnabled && screenStream) {
      console.log('Setting screen stream to video element');
      videoElement.srcObject = screenStream;
      playVideo();
    }
    // If no display but camera is enabled, show camera
    else if (!isDisplayEnabled && isCameraEnabled && cameraStream) {
      console.log('Setting camera stream to video element');
      videoElement.srcObject = cameraStream;
      playVideo();
    }
    // Otherwise clear the video
    else {
      console.log('Clearing video element source');
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
