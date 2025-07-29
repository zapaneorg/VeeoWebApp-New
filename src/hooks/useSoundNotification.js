import { useRef, useEffect, useCallback, useState } from 'react';
import { Howl, Howler } from 'howler';
import { useToast } from '@/components/ui/use-toast';

const useSoundNotification = (soundPath, volume = 0.8) => {
  const soundRef = useRef(null);
  const isPlayingRef = useRef(false);
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);
  const { toast } = useToast();

  const unlockAudio = useCallback(() => {
    if (Howler.ctx.state === 'suspended') {
      Howler.ctx.resume().then(() => {
        setIsAudioBlocked(false);
        toast({
          title: "Son activé",
          description: "Les notifications sonores sont maintenant activées.",
          variant: "success",
        });
        if (isPlayingRef.current) {
          soundRef.current?.play();
        }
      });
    } else {
      setIsAudioBlocked(false);
    }
  }, [toast]);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [soundPath],
      html5: true,
      volume: volume,
      loop: true,
      onplayerror: () => {
        setIsAudioBlocked(true);
        soundRef.current.once('unlock', () => {
          setIsAudioBlocked(false);
          if (isPlayingRef.current) {
            soundRef.current.play();
          }
        });
      },
      onplay: () => {
        setIsAudioBlocked(false);
      }
    });

    return () => {
      soundRef.current?.unload();
    };
  }, [soundPath, volume]);

  const play = useCallback(() => {
    if (soundRef.current && !soundRef.current.playing()) {
      isPlayingRef.current = true;
      const playId = soundRef.current.play();
      
      // Check if audio context is suspended after trying to play
      if (Howler.ctx.state === 'suspended') {
        setIsAudioBlocked(true);
      } else {
        setIsAudioBlocked(false);
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (soundRef.current?.playing()) {
      isPlayingRef.current = false;
      soundRef.current.stop();
    }
  }, []);

  return { play, stop, isAudioBlocked, unlockAudio };
};

export default useSoundNotification;