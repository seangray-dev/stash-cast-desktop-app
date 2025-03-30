import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DesktopSource } from '@/hooks/use-media-sources';
import { MonitorIcon } from 'lucide-react';
import { useState } from 'react';

interface DisplaysDialogProps {
  screens: DesktopSource[];
  onSelect: (screen: DesktopSource) => void;
}

export default function DisplaysDialog({
  screens,
  onSelect,
}: DisplaysDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='flex items-center gap-2 justify-start px-2 w-full'>
          <MonitorIcon className='w-size-4' />
          Full Screen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Display</DialogTitle>
          <DialogDescription>
            Choose which display you want to capture.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {screens.map((screen) => (
            <Button
              key={screen.id}
              variant='outline'
              className='flex items-center gap-2 justify-start'
              onClick={() => {
                onSelect(screen);
                setOpen(false);
              }}>
              <MonitorIcon className='w-size-4' />
              {screen.name}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
