import CameraSelector from './camera-selector';
import DisplaySelector from './display-selector';
import MicSelector from './mic-selector';
import RecordButton from './record-button';
import ScreenCapture from './screen-capture';

export function MediaConfig() {
  return (
    <div className='flex flex-1 flex-col gap-4'>
      <ScreenCapture />
      <div className='flex flex-wrap items-center justify-center gap-1'>
        <DisplaySelector />
        <MicSelector />
        <CameraSelector />
        <RecordButton />
      </div>
    </div>
  );
}
