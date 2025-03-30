import { useState } from 'react';

import {
  ChevronDown,
  Cog,
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
import { isScreen, isWindow, useMediaSources } from '@/hooks/use-media-sources';
import DisplaysDialog from './displays-dialog';
import MediaSelectorSkeleton from './media-selector-skeleton';
import WindowsDialog from './windows-dialog';

export default function DisplaySelector() {
  const [displayEnabled, setDisplayEnabled] = useState(false);
  const { data, isPending } = useMediaSources();

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
      <Button
        size={'icon'}
        className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
        variant={displayEnabled ? 'default' : 'destructive'}
        onClick={() => setDisplayEnabled(!displayEnabled)}>
        <span className='sr-only'>Toggle display on/off</span>
        {displayEnabled ? (
          <ScreenShareIcon size={24} />
        ) : (
          <ScreenShareOffIcon size={24} />
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
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
