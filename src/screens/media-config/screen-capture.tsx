import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { useMediaConfig } from './media-config-context';

export default function ScreenCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { screenStream } = useMediaConfig();

  // Update video source when stream changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  return (
    <div className='flex flex-col'>
      <div
        className={cn('aspect-video w-full rounded-lg border bg-muted', {
          'bg-muted': !screenStream,
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
