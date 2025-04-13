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
import { useCurrentDevice } from '@/hooks/use-workspace-query';
import useMediaConfigStore from '@/stores/media-config-store';
import { useWorkspaceStore, useWorkspaceSync } from '@/stores/workspaces-store';
import { Workspace } from '@/types/workspace';
import { ChevronDown, Plus } from 'lucide-react';

export default function WorkspaceSelector() {
  const {
    handleCameraChange,
    handleMicChange,
    handleScreenChange,
    setIsCameraEnabled,
    setIsMicrophoneEnabled,
    setIsDisplayEnabled,
  } = useMediaConfigStore();

  // Get workspaces from store and sync with DB
  const { isLoading } = useWorkspaceSync();
  const { data: currentDevice } = useCurrentDevice();
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const currentWorkspace = useWorkspaceStore((state) =>
    state.getCurrentWorkspace()
  );
  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace
  );

  const applyWorkspaceSettings = (workspace: Workspace) => {
    if (!currentDevice?.id) return;

    const settings = workspace.deviceSettings[currentDevice.id];
    if (!settings) return;

    // Apply device selections using handlers
    handleScreenChange(null); // We'll need to find the screen source from mediaSources
    handleMicChange(settings.selectedMicId);
    handleCameraChange(settings.selectedCameraId);

    // Set initial toggle states
    setIsCameraEnabled(settings.defaultCameraEnabled);
    setIsMicrophoneEnabled(settings.defaultMicEnabled);
    setIsDisplayEnabled(settings.defaultDisplayEnabled);
  };

  const handleWorkspaceSelect = (workspaceId: number) => {
    setCurrentWorkspace(workspaceId);
    const workspace = useWorkspaceStore
      .getState()
      .getWorkspaceById(workspaceId);
    if (workspace) {
      applyWorkspaceSettings(workspace);
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
            onClick={() => handleWorkspaceSelect(workspace.id!)}
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
