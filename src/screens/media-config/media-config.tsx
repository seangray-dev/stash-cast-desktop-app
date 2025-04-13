import { useInitializeMediaConfig } from '@/stores/media-config-store';
import Controls from './controls';
import MediaSelectorSkeleton from './media-selector-skeleton';
import ScreenCapture from './screen-capture';

export function MediaConfig() {
  const { isLoading } = useInitializeMediaConfig();

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4'>
        <MediaSelectorSkeleton type='display' />
        <MediaSelectorSkeleton type='camera' />
        <MediaSelectorSkeleton type='microphone' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <ScreenCapture />
      <Controls />
    </div>
  );
}
