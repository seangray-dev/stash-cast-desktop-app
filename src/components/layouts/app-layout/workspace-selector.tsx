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
  const {
    handleCameraChange,
    handleMicChange,
    handleScreenChange,
    setIsCameraEnabled,
    setIsMicrophoneEnabled,
    setIsDisplayEnabled,
  } = useMediaConfig();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const applyWorkspaceSettings = useCallback(
    (result: { workspace: Workspace; settings: any }) => {
      setCurrentWorkspace(result.workspace);

      // Apply device selections using handlers
      handleScreenChange(result.settings.selectedScreenId);
      handleMicChange(result.settings.selectedMicId);
      handleCameraChange(result.settings.selectedCameraId);

      // Set initial toggle states
      setIsCameraEnabled(result.settings.isCameraEnabled);
      setIsMicrophoneEnabled(result.settings.isMicrophoneEnabled);
      setIsDisplayEnabled(result.settings.isDisplayEnabled);
    },
    [
      handleCameraChange,
      handleMicChange,
      handleScreenChange,
      setIsCameraEnabled,
      setIsMicrophoneEnabled,
      setIsDisplayEnabled,
    ]
  );

  useEffect(() => {
    const initializeWorkspaces = async () => {
      try {
        setIsLoading(true);
        // First, get the current workspace
        const current = await getCurrentWorkspace();
        if (current) {
          const result = await getWorkspaceWithSettings(current.id);
          if (result) {
            applyWorkspaceSettings(result);
          }
        }

        // Then load all workspaces
        const allWorkspaces = await getAllWorkspaces();
        setWorkspaces(allWorkspaces);
      } catch (error) {
        console.error('Error initializing workspaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWorkspaces();
  }, []); // Empty dependency array since we only want this to run once

  const handleWorkspaceSelect = async (workspaceId: number) => {
    const result = await getWorkspaceWithSettings(workspaceId);
    if (result) {
      applyWorkspaceSettings(result);
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
