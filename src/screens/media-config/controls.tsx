import { DesktopSource } from '@/hooks/use-media-sources';
import CameraSelector from './camera-selector';
import DisplaySelector from './display-selector';
import MicSelector from './mic-selector';
import RecordButton from './record-button';

interface ControlsProps {
  onSelect: (screen: DesktopSource | null) => void;
}

export default function Controls({ onSelect }: ControlsProps) {
  return (
    <div className='flex flex-wrap items-center justify-center gap-1'>
      <DisplaySelector onSelect={onSelect} />
      <MicSelector />
      <CameraSelector />
      <RecordButton />
    </div>
  );
}
