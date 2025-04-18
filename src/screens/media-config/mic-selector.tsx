import { useEffect } from 'react';

import {
  ChevronDown,
  Cog,
  CommandIcon,
  Loader2,
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
import useMediaConfigStore from '@/stores/media-config-store';

export default function MicSelector() {
  const {
    selectedMicId,
    handleMicChange,
    isMicrophoneEnabled,
    setIsMicrophoneEnabled,
    microphoneStream,
    setMicrophoneStream,
  } = useMediaConfigStore();
  const { data, isPending } = useMediaSources();

  const handleMicToggle = async () => {
    if (microphoneStream) {
      // If we have a stream, stop it
      microphoneStream.getTracks().forEach((track) => track.stop());
      setMicrophoneStream(null);
      setIsMicrophoneEnabled(false);
      return;
    }

    // If we have a selected mic but no stream, start streaming
    if (selectedMicId) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: { exact: selectedMicId },
          },
        });
        setMicrophoneStream(stream);
        setIsMicrophoneEnabled(true);
      } catch (error) {
        console.error('Error starting microphone stream:', error);
        setIsMicrophoneEnabled(false);
      }
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleMicToggle();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [selectedMicId, microphoneStream]);

  return (
    <div className='divide-primary-foreground/30 inline-flex -space-x-px divide-x rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse'>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={isPending}
              size={'icon'}
              className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
              variant={isMicrophoneEnabled ? 'default' : 'destructive'}
              onClick={handleMicToggle}>
              <span className='sr-only'>Toggle microphone on/off</span>
              {isPending ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <>
                  {isMicrophoneEnabled ? (
                    <MicIcon size={24} />
                  ) : (
                    <MicOffIcon size={24} />
                  )}
                </>
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
            disabled={isPending}
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
              onValueChange={handleMicChange}
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
