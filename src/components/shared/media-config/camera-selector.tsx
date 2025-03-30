import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMediaSources } from '@/hooks/use-media-sources';
import { CameraIcon, CameraOffIcon } from 'lucide-react';
import { useState } from 'react';
import MediaSelectorSkeleton from './media-selector-skeleton';

export default function CameraSelector() {
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const { data, isPending } = useMediaSources();

  if (isPending) {
    return <MediaSelectorSkeleton type='camera' />;
  }

  const handleVideoChange = (value: string) => {
    setSelectedVideo(value);
    // TODO: Implement video change logic
  };

  return (
    <Select value={selectedVideo} onValueChange={handleVideoChange}>
      <SelectTrigger id='video'>
        <SelectValue placeholder='Select a camera' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='none'>
          <div className='flex items-center gap-2 text-destructive'>
            <CameraOffIcon className='size-4' />
            No Camera
          </div>
        </SelectItem>
        {data?.videoinputs.map((device) => (
          <SelectItem key={device.deviceId} value={device.deviceId}>
            <div className='flex items-center gap-2'>
              <CameraIcon className='size-4' />
              <span>{device.label || `Camera ${device.deviceId}`}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
