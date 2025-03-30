import { DesktopSource } from '@/hooks/use-media-sources';
import { useState } from 'react';
import CameraSelector from './camera-selector';
import DisplaySelector from './display-selector';
import MicSelector from './mic-selector';
import RecordButton from './record-button';
import ScreenCapture from './screen-capture';

export function MediaConfig() {
  const [selectedScreen, setSelectedScreen] = useState<
    DesktopSource | undefined
  >(undefined);

  return (
    <div className='flex flex-col gap-4'>
      <ScreenCapture selectedScreen={selectedScreen} />
      <div className='flex flex-wrap items-center justify-center gap-1'>
        <DisplaySelector
          onSelect={(screen) => setSelectedScreen(screen || undefined)}
        />
        <MicSelector />
        <CameraSelector />
        <RecordButton />
      </div>
    </div>
  );
}
