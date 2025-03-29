import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMediaSources } from '@/hooks/use-media-sources';
import { MicIcon, MicOffIcon } from 'lucide-react';
import { useState } from 'react';
import MediaSelectorSkeleton from './media-selector-skeleton';

export default function MicSelector() {
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  const { data, isPending } = useMediaSources();

  if (isPending) {
    return <MediaSelectorSkeleton type='microphone' />;
  }

  const handleAudioChange = (value: string) => {
    setSelectedAudio(value);
    // TODO: Implement audio change logic
  };

  return (
    <Select value={selectedAudio} onValueChange={handleAudioChange}>
      <SelectTrigger id='audio'>
        <SelectValue placeholder='Select a microphone' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='none'>
          <div className='flex items-center gap-2 text-destructive'>
            <MicOffIcon className='size-4' />
            No Mircophone
          </div>
        </SelectItem>
        {data?.audioinputs.map((device) => (
          <SelectItem key={device.deviceId} value={device.deviceId}>
            <div className='flex items-center gap-2'>
              <MicIcon className='size-4' />
              <span>{device.label || `Microphone ${device.deviceId}`}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
