import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Workspace } from '@/db/db';
import {
  getAllWorkspaces,
  getCurrentWorkspace,
  getWorkspaceWithSettings,
} from '@/db/operations';
import { ChevronDown, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useMediaConfig } from '../../../providers/media-config-provider';

export default function WorkspaceSelector() {
  const { setMediaConfig } = useMediaConfig();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const applyWorkspaceSettings = useCallback(
    async (workspace: Workspace) => {
      console.log('🔄 Applying workspace settings for:', workspace.name);
      const settings = await getWorkspaceWithSettings(workspace.id);
      if (settings) {
        console.log('⚙️ Found settings:', settings);
        setCurrentWorkspace(settings.workspace);
        setMediaConfig({
          selectedScreenId: settings.settings.selectedScreenId,
          selectedMicId: settings.settings.selectedMicId,
          selectedCameraId: settings.settings.selectedCameraId,
          isMicrophoneEnabled: settings.settings.isMicrophoneEnabled,
          isCameraEnabled: settings.settings.isCameraEnabled,
          isDisplayEnabled: settings.settings.isDisplayEnabled,
        });
      }
    },
    [setMediaConfig]
  );

  useEffect(() => {
    const initializeWorkspaces = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Initializing workspaces');

        // First, get all workspaces
        const allWorkspaces = await getAllWorkspaces();
        console.log('📂 Found workspaces:', allWorkspaces);
        setWorkspaces(allWorkspaces);

        // Then get the current workspace
        const current = await getCurrentWorkspace();
        console.log('🎯 Current workspace:', current);

        if (current) {
          await applyWorkspaceSettings(current);
        }
      } catch (error) {
        console.error('❌ Error initializing workspaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWorkspaces();
  }, [applyWorkspaceSettings]);

  const handleWorkspaceSelect = async (workspaceId: number) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      await applyWorkspaceSettings(workspace);
    }
  };

  if (isLoading) {
    return (
      <SidebarMenuButton className='w-full flex-row items-center justify-between'>
        <span className='truncate font-semibold'>Loading...</span>
      </SidebarMenuButton>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className='w-full flex-row items-center justify-between'>
          <span className='truncate font-semibold'>
            {currentWorkspace?.name || 'Select Workspace'}
          </span>
          <ChevronDown className='opacity-50' />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-64 rounded-lg'
        align='start'
        side='bottom'
        sideOffset={4}>
        <DropdownMenuLabel className='text-xs text-muted-foreground'>
          Workspaces
        </DropdownMenuLabel>
        {workspaces.map((workspace, index) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => handleWorkspaceSelect(workspace.id)}
            className='gap-2 p-2'>
            {workspace.name}
            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className='gap-2 p-2'>
          <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
            <Plus className='size-4' />
          </div>
          <div className='font-medium text-muted-foreground'>Add Workspace</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
