import Controls from './controls';
import ScreenCapture from './screen-capture';

export function MediaConfig() {
  return (
    <div className='flex flex-col gap-4'>
      <ScreenCapture />
      <Controls />
    </div>
  );
}
