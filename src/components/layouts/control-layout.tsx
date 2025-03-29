import { cn, onCloseApp } from '@/lib/utils';
import { UserButton } from '@clerk/clerk-react';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function ControlLayout({ children, className }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  window.ipcRenderer.on('hide-plugin', (event, payload) => {
    console.log(event);
    setIsVisible(payload.state);
  });

  return (
    <div
      className={cn(
        className,
        isVisible && 'invisible',
        ' flex px-1 flex-col rounded overflow-hidden'
      )}>
      <div className='flex justify-between p-5 draggable items-center'>
        <span className='non-draggable'>
          <UserButton />
        </span>
        <Button variant='ghost' size='icon' onClick={onCloseApp}>
          <XIcon className='w-4 h-4' />
        </Button>
      </div>
      <div className='flex-1 h-0 overflow-auto'>{children}</div>
      <div className='p-5 flex w-full'>
        <img src='/electron-vite.svg' alt='logo' className='w-10 h-10' />
      </div>
    </div>
  );
}
