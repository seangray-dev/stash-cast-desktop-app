import { DesktopSource } from '@/hooks/use-media-sources';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface ScreenCaptureProps {
  selectedScreen?: DesktopSource;
}

export default function ScreenCapture({ selectedScreen }: ScreenCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!selectedScreen) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      return;
    }

    const startCapture = async () => {
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia({
          video: {
            // @ts-ignore - Electron's desktopCapturer requires these properties
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: selectedScreen.id,
            },
          },
        });

        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error capturing screen:', error);
      }
    };

    startCapture();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedScreen]);

  return (
    <div className='flex flex-col'>
      <div
        className={cn('aspect-video w-full rounded-lg border bg-muted', {
          'bg-muted': !stream,
        })}>
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
