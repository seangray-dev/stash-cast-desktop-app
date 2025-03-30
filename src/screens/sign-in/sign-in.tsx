import { SignIn, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export default function SignInScreen() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to='/' />;
  }

  return (
    <div className='h-screen w-screen flex justify-center items-center drag'>
      <div className='no-drag'>
        <SignIn />
      </div>
    </div>
  );
}
