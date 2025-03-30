import { CameraIcon, MicIcon, MonitorIcon } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';

export default function MediaSelectorSkeleton({
  type,
}: {
  type: 'microphone' | 'camera' | 'display';
}) {
  return (
    <Skeleton className='w-full h-9 flex items-center justify-start gap-2 p-2'>
      {type === 'microphone' && <MicIcon className='size-4' />}
      {type === 'camera' && <CameraIcon className='size-4' />}
      {type === 'display' && <MonitorIcon className='size-4' />}
      <span className='text-sm'>Loading {type}s...</span>
    </Skeleton>
  );
}
