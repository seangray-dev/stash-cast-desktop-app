import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMediaSources } from '@/hooks/use-media-sources';
import {
  AppWindowMacIcon,
  MonitorIcon,
  ScreenShareIcon,
  ScreenShareOffIcon,
  SquareDashedIcon,
} from 'lucide-react';
import MediaSelectorSkeleton from './media-selector-skeleton';

export default function DisplaySelector() {
  const { data, isPending } = useMediaSources();

  if (isPending) {
    return <MediaSelectorSkeleton type='display' />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='flex items-center gap-2 w-full justify-start'>
          <ScreenShareIcon className='w-size-4' />
          <span className='text-sm'>Screen Capture</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {/* When selected opens a dialog. If detected multiple displays, select which display to capture fullscreen of. If only one display, capture fullscreen of that display */}
          <DropdownMenuItem className='flex items-center gap-2'>
            <MonitorIcon className='w-size-4' />
            Full Screen
          </DropdownMenuItem>
          {/* When selected opens a dialog. If detected multiple displays, first select display, then select which window within that display to capture */}
          <DropdownMenuItem className='flex items-center gap-2'>
            <AppWindowMacIcon className='w-size-4' />
            Specific Window
          </DropdownMenuItem>
          {/* When Selcted closes the dropdown and allows users to position the window capture area */}
          <DropdownMenuItem className='flex items-center gap-2'>
            <SquareDashedIcon className='w-size-4' />
            Custom Size
          </DropdownMenuItem>
          <DropdownMenuItem className='flex items-center gap-2 text-destructive'>
            <ScreenShareOffIcon className='w-size-4' />
            None
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
