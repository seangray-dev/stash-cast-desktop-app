import Controls from './controls';
import { MediaConfigProvider } from './media-config-context';
import ScreenCapture from './screen-capture';

export function MediaConfig() {
  return (
    <MediaConfigProvider>
      <div className='flex flex-col gap-4'>
        <ScreenCapture />
        <Controls />
      </div>
    </MediaConfigProvider>
  );
}
