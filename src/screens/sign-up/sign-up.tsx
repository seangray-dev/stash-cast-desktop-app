import { SignUp } from '@clerk/clerk-react';

export default function SignUpScreen() {
  return (
    <div className='h-screen w-screen flex justify-center items-center drag'>
      <div className='no-drag'>
        <SignUp />
      </div>
    </div>
  );
}
