import CameraSelector from './camera-selector';
import DisplaySelector from './display-selector';
import MicSelector from './mic-selector';

export function MediaConfig() {
  return (
    <div className='space-y-4'>
      <DisplaySelector />
      <MicSelector />
      <CameraSelector />
    </div>
  );
}
