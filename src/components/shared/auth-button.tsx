import { SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Button } from '../ui/button';

export default function AuthButton() {
  return (
    <SignedOut>
      <div className='flex gap-x-3 h-screen justify-center items-center'>
        <Button asChild variant={'outline'} className='px-10'>
          <SignInButton mode='modal' />
        </Button>
        <Button asChild variant={'outline'} className='px-10'>
          <SignUpButton />
        </Button>
      </div>
    </SignedOut>
  );
}
