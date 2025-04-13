import { useEffect, useRef, useState } from 'react';

import { Progress } from '@/components/ui/progress';
import { MicIcon } from 'lucide-react';

import { useMediaConfig } from '../../providers/media-config-provider';

const dbToPercentage = (db: number): number => {
  // Clamp at 0dB (no headroom in display)
  if (db >= 0) return 100;
  // Below -60dB is effectively silence
  if (db <= -60) return 0;

  // Professional scaling that matches hardware interface
  // More movement in lower ranges, earlier color transitions
  if (db < -54) {
    return ((db + 60) / 6) * 5; // First 5%
  } else if (db < -48) {
    return 5 + ((db + 54) / 6) * 10; // Next 10%
  } else if (db < -36) {
    return 15 + ((db + 48) / 12) * 20; // Next 20%
  } else if (db < -24) {
    return 35 + ((db + 36) / 12) * 25; // 25% for important range
  } else if (db < -12) {
    return 60 + ((db + 24) / 12) * 25; // Critical zone
  }
  return 85 + ((db + 12) / 12) * 15; // Peak zone
};

export default function MicLevel() {
  const { microphoneStream, isMicrophoneEnabled } = useMediaConfig();
  const [volume, setVolume] = useState(0);
  const [currentDb, setCurrentDb] = useState(-60);
  const animationFrameRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!microphoneStream || !isMicrophoneEnabled) {
      setVolume(0);
      setCurrentDb(-60);
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    analyserRef.current = audioContext.createAnalyser();
    const analyser = analyserRef.current;
    const microphone = audioContext.createMediaStreamSource(microphoneStream);

    // Professional audio settings
    analyser.fftSize = 2048;
    analyser.minDecibels = -90; // Extended range for better low-end sensitivity
    analyser.maxDecibels = 0;
    analyser.smoothingTimeConstant = 0.2; // Even faster response time

    microphone.connect(analyser);

    const dataArray = new Float32Array(analyser.fftSize);

    const updateVolume = () => {
      analyser.getFloatTimeDomainData(dataArray);

      // Calculate RMS (Root Mean Square)
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length);

      // Convert to dB with gain compensation
      const db = 20 * Math.log10(Math.max(rms, 1e-15)) + 30; // Increased gain compensation to match interface levels
      const clampedDb = Math.max(-60, Math.min(0, db));
      setCurrentDb(clampedDb);

      // Convert to percentage using pro audio scale
      const normalizedVolume = dbToPercentage(clampedDb);

      setVolume((prev) => {
        const delta = normalizedVolume - prev;
        // Faster response for better visual feedback
        const smoothing = delta > 0 ? 0.6 : 0.2;
        return prev + delta * smoothing;
      });

      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      microphone.disconnect();
      analyser.disconnect();
      setVolume(0);
      setCurrentDb(-60);
    };
  }, [microphoneStream, isMicrophoneEnabled]);

  return (
    <div className='flex flex-col gap-1 max-w-sm mx-auto w-full'>
      <div className='flex items-center gap-2 w-full'>
        <MicIcon className='size-5' />
        <Progress value={volume} className='w-full h-2 rounded-full' />
      </div>
      <div className='w-full flex justify-between text-[10px] text-muted-foreground px-1'>
        <span>-60dB</span>
        <span>-48dB</span>
        <span>-36dB</span>
        <span>-24dB</span>
        <span>-12dB</span>
        <span>0dB</span>
      </div>
      <div className='text-xs text-center text-muted-foreground'>
        {currentDb.toFixed(1)}dB
      </div>
    </div>
  );
}
