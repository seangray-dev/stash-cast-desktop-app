import { useEffect, useState } from 'react';

import {
  ChevronDown,
  Cog,
  CommandIcon,
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
import {
  DesktopSource,
  isScreen,
  isWindow,
  useMediaSources,
} from '@/hooks/use-media-sources';
import DisplaysDialog from './displays-dialog';
import MediaSelectorSkeleton from './media-selector-skeleton';
import WindowsDialog from './windows-dialog';

interface DisplaySelectorProps {
  onSelect: (screen: DesktopSource | null) => void;
}

export default function DisplaySelector({ onSelect }: DisplaySelectorProps) {
  const [displayEnabled, setDisplayEnabled] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<DesktopSource | null>(
    null
  );
  const { data, isPending } = useMediaSources();

  const handleDisplayToggle = () => {
    const newDisplayEnabled = !displayEnabled;
    setDisplayEnabled(newDisplayEnabled);

    if (!newDisplayEnabled) {
      // When turning off, stop sharing but keep the selected screen
      onSelect(null);
    } else if (selectedScreen) {
      // When turning on and we have a screen selected, start sharing it
      onSelect(selectedScreen);
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
  }, [displayEnabled, selectedScreen, onSelect]);

  const handleScreenSelect = (screen: DesktopSource) => {
    setSelectedScreen(screen);
    setDisplayEnabled(true);
    onSelect(screen);
  };

  // Early returns after all hooks
  if (!data) {
    return null;
  }

  const screens = data.displays.filter(isScreen);
  const windows = data.displays.filter(isWindow);

  if (isPending) {
    return <MediaSelectorSkeleton type='display' />;
  }

  return (
    <div className='divide-primary-foreground/30 inline-flex -space-x-px divide-x rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse'>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'icon'}
              className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
              variant={displayEnabled ? 'default' : 'destructive'}
              onClick={handleDisplayToggle}>
              <span className='sr-only'>Toggle display on/off</span>
              {displayEnabled ? (
                <ScreenShareIcon size={24} />
              ) : (
                <ScreenShareOffIcon size={24} />
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
            variant={displayEnabled ? 'default' : 'destructive'}
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
          <DisplaysDialog screens={screens} onSelect={handleScreenSelect} />
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
