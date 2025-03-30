import { CommandIcon, SidebarIcon, XIcon } from 'lucide-react';

import { SearchForm } from '@/components/layouts/app-layout/search-form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import KBD from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { onCloseApp } from '@/lib/utils';

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className='flex sticky top-0 z-50 w-full items-center border-b bg-background drag'>
      <div className='flex h-[--header-height] w-full items-center gap-2 px-4'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className='h-8 w-8 no-drag'
                variant='ghost'
                size='icon'
                onClick={toggleSidebar}>
                <SidebarIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className='flex items-center gap-2'>
                Toggle Sidebar
                <KBD>
                  <CommandIcon size={8} />
                  <span>B</span>
                </KBD>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb className='hidden sm:block no-drag'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='#'>
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className='w-full sm:ml-auto sm:w-auto no-drag' />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={'ghost'}
                size={'icon'}
                onClick={onCloseApp}
                className='no-drag'>
                <XIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className='text-xs flex items-center gap-2'>
                Close Application
                <KBD>
                  <CommandIcon size={8} />
                  <span>Q</span>
                </KBD>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
