import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Repeat, Download, Music, ChevronUp, ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

declare global {
  interface Window {
    __bostromBgAudio?: HTMLAudioElement;
  }
}

const AUDIO_SRC = '/audio/background-music.mp3';

const getGlobalAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;
  if (!window.__bostromBgAudio) {
    const audio = new Audio(AUDIO_SRC);
    audio.preload = 'auto';
    window.__bostromBgAudio = audio;
  }
  return window.__bostromBgAudio;
};

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isLooping, setIsLooping] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Ensure there's only ONE audio instance (prevents overlap on hot reload / remount)
  useEffect(() => {
    const audio = getGlobalAudio();
    if (!audio) return;
    audioRef.current = audio;

    // If any old <audio> tags are lingering (dev hot reload), stop them.
    document.querySelectorAll('audio').forEach((el) => {
      try {
        el.pause();
      } catch {
        // ignore
      }
    });

    // Hard-stop any previous playback before starting (fixes the "two tracks" bug)
    audio.pause();
    audio.currentTime = 0;

    // Apply initial settings
    audio.loop = isLooping;
    audio.volume = volume / 100;
    audio.muted = isMuted;

    // Keep UI in sync with the audio element
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    setCurrentTime(audio.currentTime || 0);
    setDuration(audio.duration || 0);
    setIsPlaying(!audio.paused);

    let interactionHandler: (() => void) | null = null;

    // Attempt to autoplay
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay was prevented by browser, wait for first interaction
          setIsPlaying(false);
          interactionHandler = () => {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
            document.removeEventListener('click', interactionHandler!);
            document.removeEventListener('keydown', interactionHandler!);
            interactionHandler = null;
          };
          document.addEventListener('click', interactionHandler);
          document.addEventListener('keydown', interactionHandler);
        });
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      if (interactionHandler) {
        document.removeEventListener('click', interactionHandler);
        document.removeEventListener('keydown', interactionHandler);
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = isLooping;
  }, [isLooping]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      const audio = audioRef.current;
      if (audio) audio.muted = next;
      return next;
    });
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume / 100;
      if (newVolume === 0) audio.muted = true;
      if (newVolume > 0 && isMuted) audio.muted = false;
    }
    if (newVolume === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleLoop = () => {
    setIsLooping((v) => !v);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/audio/background-music.mp3';
    link.download = 'bostrom-soundtrack.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-background/90 backdrop-blur-md border border-border rounded-xl overflow-hidden box-glow-primary">
          {/* Collapsed state - just play button */}
          <div className="flex items-center gap-3 p-3">
            <button
              onClick={togglePlay}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isPlaying 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary'
              }`}
            >
              <Music className="w-5 h-5" />
            </button>
            
            <span className="font-play text-sm text-muted-foreground hidden sm:block">
              {isPlaying ? 'Now Playing' : 'Play Music'}
            </span>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* Expanded controls */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {/* Timeline / Seek control */}
                  <div className="space-y-2">
                    <Slider
                      value={[currentTime]}
                      onValueChange={handleSeek}
                      max={duration || 100}
                      step={0.1}
                      disabled={!duration}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs font-mono text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Volume control */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleMute}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="font-mono text-xs text-muted-foreground w-8 text-right">
                      {isMuted ? 0 : volume}%
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={toggleLoop}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        isLooping 
                          ? 'bg-primary/20 text-primary' 
                          : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                      }`}
                    >
                      <Repeat className="w-4 h-4" />
                      <span className="font-play text-xs">Repeat</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span className="font-play text-xs">Download</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};
