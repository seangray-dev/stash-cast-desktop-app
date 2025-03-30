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
import { AppWindowMacIcon } from 'lucide-react';

interface WindowsDialogProps {
  windows: DesktopSource[];
}

export default function WindowsDialog({ windows }: WindowsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='flex items-center gap-2 justify-start px-2'>
          <AppWindowMacIcon className='w-size-4' />
          Specific Window
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Window</DialogTitle>
          <DialogDescription>
            Choose which window you want to capture.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {windows.map((window) => (
            <Button
              key={window.id}
              variant='outline'
              className='flex items-center gap-2 justify-start'
              onClick={() => {
                // TODO: Implement window capture logic
                console.log('Selected window:', window);
              }}>
              <AppWindowMacIcon className='w-size-4' />
              {window.name}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button variant='outline'>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
