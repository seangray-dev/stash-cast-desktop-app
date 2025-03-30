import CameraSelector from './camera-selector';
import DisplaySelector from './display-selector';
import MicSelector from './mic-selector';
import RecordButton from './record-button';

export default function Controls() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-center gap-1'>
        <DisplaySelector />
        <MicSelector />
        <CameraSelector />
        <RecordButton />
      </div>
    </div>
  );
}
