import { AppSidebar } from '@/components/layouts/app-layout/app-sidebar';
import { SiteHeader } from '@/components/layouts/app-layout/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AppLayout() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Navigate to='/sign-in' />;
  }

  return (
    <div className='[--header-height:calc(theme(spacing.14))]'>
      <SidebarProvider className='flex flex-col'>
        <SiteHeader />
        <div className='flex flex-1'>
          <AppSidebar />
          <SidebarInset className='px-8 py-4'>
            <Outlet />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
