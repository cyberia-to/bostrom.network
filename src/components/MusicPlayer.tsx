import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Repeat, Download, Music, ChevronUp, ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isLooping, setIsLooping] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.loop = isLooping;
    }
  }, [volume, isLooping]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
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
      <audio ref={audioRef} src="/audio/background-music.mp3" loop={isLooping} />
      
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
