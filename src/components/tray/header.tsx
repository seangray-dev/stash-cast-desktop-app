import { UserButton, useAuth } from '@clerk/clerk-react';
import { Button } from '../ui/button';

export default function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className=''>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <Button
          variant='default'
          className='bg-emerald-900 hover:bg-emerald-800'>
          Sign In
        </Button>
      )}
    </header>
  );
}
