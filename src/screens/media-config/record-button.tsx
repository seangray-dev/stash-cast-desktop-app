import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, CircleDotIcon, CircleStopIcon, Cog } from 'lucide-react';
import { useState } from 'react';
import { useMediaConfig } from '../../providers/media-config-provider';
import { RecordingService } from '../../services/recording-service';

const recordingService = new RecordingService();

export default function RecordButton() {
  const [isRecording, setIsRecording] = useState(false);
  const [saveLocation, setSaveLocation] = useState('desktop');
  const [timer, setTimer] = useState('none');
  const [showMouseClicks, setShowMouseClicks] = useState(false);
  const {
    screenStream,
    cameraStream,
    microphoneStream,
    isDisplayEnabled,
    isCameraEnabled,
    isMicrophoneEnabled,
  } = useMediaConfig();

  const handleRecordToggle = async () => {
    try {
      if (!isRecording) {
        // Start recording
        const videoStream = screenStream || cameraStream;
        if (!videoStream) {
          console.error('No video stream available for recording');
          return;
        }

        const success = await recordingService.startRecording(
          videoStream,
          isMicrophoneEnabled ? microphoneStream : null
        );

        if (success) {
          setIsRecording(true);
        }
      } else {
        // Stop recording immediately
        recordingService.stopRecording();
        setIsRecording(false);

        // Then handle saving
        const filePath = await recordingService.saveRecording();
        if (filePath) {
          console.log('Recording saved to:', filePath);
        }
      }
    } catch (error) {
      console.error('Error toggling recording:', error);
      setIsRecording(false);
    }
  };

  const hasVideoSource = isDisplayEnabled || isCameraEnabled;

  return (
    <div className='divide-primary-foreground/30 inline-flex -space-x-px divide-x rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse'>
      <Button
        className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10'
        variant={!isRecording ? 'default' : 'destructive'}
        onClick={handleRecordToggle}
        disabled={!hasVideoSource}>
        <span className='sr-only'>Toggle record on/off</span>
        {!isRecording ? (
          <>
            <CircleDotIcon size={24} />
            <span className='text-xs'>Start Recording</span>
          </>
        ) : (
          <>
            <CircleStopIcon size={24} />
            <span className='text-xs'>Stop Recording</span>
          </>
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={isRecording}
            variant={isRecording ? 'destructive' : 'default'}
            className='rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 group'
            size='icon'
            aria-label='Options'>
            <ChevronDown
              size={16}
              strokeWidth={2}
              aria-hidden='true'
              className='transition-transform duration-300 group-data-[state=open]:rotate-180'
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Save to</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={saveLocation}
            onValueChange={setSaveLocation}>
            <DropdownMenuRadioItem value='desktop'>
              Desktop
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='documents'>
              Documents
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='other'>
              Other Location...
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Timer</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={timer} onValueChange={setTimer}>
            <DropdownMenuRadioItem value='none'>None</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='5'>5 seconds</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='10'>10 seconds</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showMouseClicks}
            onCheckedChange={setShowMouseClicks}>
            Show Mouse Clicks
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Button
              variant='ghost'
              className='w-full justify-start font-normal'>
              <Cog size={16} aria-hidden='true' />
              Settings
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
