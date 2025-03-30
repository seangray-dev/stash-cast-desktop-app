import { api } from '@/convex/api';
import { ClerkLoading, SignedIn, useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import Loader from './loader';
import { MediaConfig } from './media-config/media-config';

export default function Widget() {
  const [profile, setProfile] = useState<any>(null);
  const { user } = useUser();
  const data = useQuery(api.queries.users.getMyUser);

  console.log(data);

  return (
    <div className='p-5'>
      <ClerkLoading>
        <div className='h-full flex justify-center items-center'>
          <Loader />
        </div>
      </ClerkLoading>
      <SignedIn>
        <MediaConfig />
      </SignedIn>
    </div>
  );
}
