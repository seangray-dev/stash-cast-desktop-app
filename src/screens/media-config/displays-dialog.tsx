import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DesktopSource } from '@/hooks/use-media-sources';
import { MonitorIcon } from 'lucide-react';
import { useState } from 'react';
import { useMediaConfig } from './media-config-context';

interface DisplaysDialogProps {
  screens: DesktopSource[];
}

export default function DisplaysDialog({ screens }: DisplaysDialogProps) {
  const { setSelectedScreen, setIsDisplayEnabled } = useMediaConfig();
  const [open, setOpen] = useState(false);

  const handleSelect = (screen: DesktopSource) => {
    setSelectedScreen(screen);
    setIsDisplayEnabled(true);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='flex items-center gap-2 justify-start px-2 w-full'>
          <MonitorIcon className='w-size-4' />
          Entire Screen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Screen</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-4'>
          {screens.map((screen) => (
            <Button
              key={screen.id}
              variant='outline'
              className='flex flex-col items-center gap-2 p-2 h-auto'
              onClick={() => handleSelect(screen)}>
              <div className='relative w-full aspect-video bg-background'>
                <img
                  src={screen.thumbnail.toString()}
                  alt={screen.name}
                  className='w-full h-full object-contain rounded-md'
                />
              </div>
              <span className='text-sm font-medium'>{screen.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
