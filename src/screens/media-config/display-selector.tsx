import { useEffect } from 'react';

import {
  ChevronDown,
  Cog,
  CommandIcon,
  Loader2,
  ScreenShareIcon,
  ScreenShareOffIcon,
  SquareDashedIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import KBD from '@/components/ui/kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { isScreen, isWindow, useMediaSources } from '@/hooks/use-media-sources';
import useMediaConfigStore from '@/stores/media-config-store';
import DisplaysDialog from './displays-dialog';
import WindowsDialog from './windows-dialog';

export default function DisplaySelector() {
  const {
    selectedScreen,
    screenStream,
    setScreenStream,
    handleScreenChange,
    isDisplayEnabled,
    setIsDisplayEnabled,
  } = useMediaConfigStore();
  const { data, isPending } = useMediaSources();

  const handleDisplayToggle = async () => {
    if (screenStream) {
      // If we have a stream, stop it
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setIsDisplayEnabled(false);
      return;
    }

    // If we have a selected screen but no stream, start streaming
    if (selectedScreen) {
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia({
          video: {
            // @ts-ignore - Electron's desktopCapturer requires these properties
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: selectedScreen.id,
            },
          },
        });
        setScreenStream(stream);
        setIsDisplayEnabled(true);
      } catch (error) {
        console.error('Error capturing screen:', error);
        setIsDisplayEnabled(false);
      }
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleDisplayToggle();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [selectedScreen, screenStream]);

  const screens = data?.displays.filter(isScreen) ?? [];
  const windows = data?.displays.filter(isWindow) ?? [];

  return (
    <div className='divide-primary-foreground/30 inline-flex -space-x-px divide-x rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse'>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'icon'}
              className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
              variant={isDisplayEnabled ? 'default' : 'destructive'}
              onClick={handleDisplayToggle}
              disabled={!selectedScreen || isPending}>
              <span className='sr-only'>Toggle display on/off</span>
              {isPending ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <>
                  {isDisplayEnabled ? (
                    <ScreenShareIcon size={24} />
                  ) : (
                    <ScreenShareOffIcon size={24} />
                  )}
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className='flex items-center gap-2'>
              Toggle display on/off
              <KBD>
                <CommandIcon size={8} />
                <span>S</span>
              </KBD>
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={isPending}
            variant={isDisplayEnabled ? 'default' : 'destructive'}
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
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Screen</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DisplaysDialog screens={screens} />
          <WindowsDialog windows={windows} />
          <Button
            variant='ghost'
            className='flex items-center gap-2 justify-start px-2 w-full'>
            <SquareDashedIcon className='w-size-4' />
            Custom Size
          </Button>
          <DropdownMenuSeparator />
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
