import { useEffect } from 'react';

import {
  ChevronDown,
  Cog,
  CommandIcon,
  MicIcon,
  MicOffIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import KBD from '@/components/ui/kbd';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMediaSources } from '@/hooks/use-media-sources';
import { useMediaConfig } from '../../providers/media-config-provider';
import MediaSelectorSkeleton from './media-selector-skeleton';

export default function MicSelector() {
  const {
    selectedMicId,
    setSelectedMicId,
    isMicrophoneEnabled,
    setIsMicrophoneEnabled,
  } = useMediaConfig();
  const { data, isPending } = useMediaSources();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsMicrophoneEnabled(!isMicrophoneEnabled);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setIsMicrophoneEnabled]);

  if (isPending) {
    return <MediaSelectorSkeleton type='microphone' />;
  }

  return (
    <div className='divide-primary-foreground/30 inline-flex -space-x-px divide-x rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse'>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'icon'}
              className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
              variant={isMicrophoneEnabled ? 'default' : 'destructive'}
              onClick={() => setIsMicrophoneEnabled(!isMicrophoneEnabled)}>
              <span className='sr-only'>Toggle microphone on/off</span>
              {isMicrophoneEnabled ? (
                <MicIcon size={24} />
              ) : (
                <MicOffIcon size={24} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className='flex items-center gap-2'>
              Toggle microphone on/off
              <KBD>
                <CommandIcon size={8} />
                <span>D</span>
              </KBD>
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isMicrophoneEnabled ? 'default' : 'destructive'}
            className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 group'
            size='icon'
            aria-label='Options'>
            <ChevronDown
              size={16}
              strokeWidth={2}
              aria-hidden='true'
              className='transition-transform duration-300 group-data-[state=open]:rotate-180'
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='center' className='min-w-[220px]'>
          <DropdownMenuLabel>Select Microphone</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className='p-2'>
            <DropdownMenuRadioGroup
              value={selectedMicId || ''}
              onValueChange={setSelectedMicId}
              className='space-y-1.5'>
              {data?.audioinputs.map((device) => (
                <DropdownMenuRadioItem
                  key={device.deviceId}
                  value={device.deviceId}
                  id={device.deviceId}>
                  <Label
                    htmlFor={device.deviceId}
                    className='font-normal cursor-pointer'>
                    <div className='flex items-center gap-2'>
                      <MicIcon className='size-4' />
                      <span>
                        {device.label || `Microphone ${device.deviceId}`}
                      </span>
                    </div>
                  </Label>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Button
              variant='ghost'
              className='w-full justify-start font-normal'>
              <Cog size={16} aria-hidden='true' className='mr-2' />
              Settings
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
