import { useState } from 'react';

import { ChevronDown, Cog, MicIcon, MicOffIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMediaSources } from '@/hooks/use-media-sources';
import MediaSelectorSkeleton from './media-selector-skeleton';

export default function MicSelector() {
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');
  const { data, isPending } = useMediaSources();

  if (isPending) {
    return <MediaSelectorSkeleton type='microphone' />;
  }

  return (
    <div className='divide-primary-foreground/30 inline-flex -space-x-px divide-x rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse'>
      <Button
        size={'icon'}
        className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
        variant={microphoneEnabled ? 'default' : 'destructive'}
        onClick={() => setMicrophoneEnabled(!microphoneEnabled)}>
        <span className='sr-only'>Toggle microphone on/off</span>
        {microphoneEnabled ? <MicIcon size={24} /> : <MicOffIcon size={24} />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
            size='icon'
            aria-label='Options'>
            <ChevronDown size={16} strokeWidth={2} aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='center'>
          <DropdownMenuLabel>Microphone</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {data?.audioinputs.map((device) => (
            <DropdownMenuItem
              key={device.deviceId}
              onSelect={() => setSelectedMicrophone(device.deviceId)}>
              <div className='flex items-center gap-2'>
                <MicIcon className='size-4' />
                <span>{device.label || `Microphone ${device.deviceId}`}</span>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild>
            <Button
              variant='ghost'
              className='w-full justify-start font-normal'>
              <Cog size={16} aria-hidden='true' />
              Settings
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
