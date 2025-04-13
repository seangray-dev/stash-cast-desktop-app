import { useEffect } from 'react';

import {
  ChevronDown,
  Cog,
  CommandIcon,
  Loader2,
  VideoIcon,
  VideoOffIcon,
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

export default function CameraSelector() {
  const {
    selectedCameraId,
    isCameraEnabled,
    setIsCameraEnabled,
    handleCameraChange,
  } = useMediaConfig();
  const { data, isPending } = useMediaSources();

  const handleCameraToggle = () => {
    setIsCameraEnabled(!isCameraEnabled);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'e' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleCameraToggle();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCameraEnabled]);

  return (
    <div className='divide-primary-foreground/30 inline-flex -space-x-px divide-x rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse'>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'icon'}
              className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
              variant={isCameraEnabled ? 'default' : 'destructive'}
              onClick={handleCameraToggle}
              disabled={!selectedCameraId || isPending}>
              <span className='sr-only'>Toggle camera on/off</span>
              {isPending ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <>
                  {isCameraEnabled ? (
                    <VideoIcon size={24} />
                  ) : (
                    <VideoOffIcon size={24} />
                  )}
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className='flex items-center gap-2'>
              Toggle camera on/off
              <KBD>
                <CommandIcon size={8} />
                <span>E</span>
              </KBD>
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={isPending}
            variant={isCameraEnabled ? 'default' : 'destructive'}
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
        <DropdownMenuContent align='center'>
          <DropdownMenuLabel>Camera</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedCameraId || ''}
            onValueChange={handleCameraChange}
            className='space-y-1.5'>
            {data?.videoinputs.map((device) => (
              <DropdownMenuRadioItem
                key={device.deviceId}
                value={device.deviceId}
                id={device.deviceId}>
                <Label
                  htmlFor={device.deviceId}
                  className='font-normal cursor-pointer'>
                  <div className='flex items-center gap-2'>
                    <VideoIcon className='size-4' />
                    <span>{device.label || `Camera ${device.deviceId}`}</span>
                  </div>
                </Label>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
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
