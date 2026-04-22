import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';
import { Track } from '../types';
import { PLAYLIST } from '../constants';

interface MusicPlayerProps {
  onTrackChange?: (track: Track) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onTrackChange }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (onTrackChange) {
      onTrackChange(currentTrack);
    }
  }, [currentTrack, onTrackChange]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("AUDIO_STREAM_ERROR:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="bg-glitch-black border-4 border-glitch-cyan p-6 shadow-glitch-magenta w-full max-w-md flex flex-col gap-6 relative screen-tear">
      {/* Decorative corner brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-glitch-yellow -translate-x-2 -translate-y-2"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-glitch-yellow translate-x-2 translate-y-2"></div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      {/* Header */}
      <div className="border-b-2 border-glitch-gray pb-2 flex justify-between items-center">
        <span className="text-glitch-magenta text-xl font-bold glitch-text" data-text="[AUDIO_MODULE]">
          [AUDIO_MODULE]
        </span>
        <Terminal className="text-glitch-cyan" size={24} />
      </div>

      {/* Now Playing Info */}
      <div className="flex flex-col gap-2 bg-glitch-gray p-4 border-l-4 border-glitch-magenta">
        <div className="text-glitch-yellow text-sm">>> DECODING_STREAM...</div>
        <h3 className="text-white font-bold text-2xl truncate uppercase">{currentTrack.title}</h3>
        <p className="text-glitch-cyan text-lg truncate uppercase">SRC: {currentTrack.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-6 bg-glitch-gray border-2 border-glitch-cyan cursor-pointer relative" onClick={handleProgressClick}>
        <div 
          className="h-full bg-glitch-magenta transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white mix-blend-difference pointer-events-none">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-glitch-dark p-2 border-2 border-glitch-gray">
        <button 
          onClick={toggleMute}
          className="text-glitch-cyan hover:text-glitch-yellow hover:bg-glitch-gray transition-colors p-2 border-2 border-transparent hover:border-glitch-cyan"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            className="text-white hover:text-glitch-cyan bg-glitch-gray p-2 border-2 border-glitch-gray hover:border-glitch-cyan active:translate-y-1"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-16 h-12 bg-glitch-cyan text-glitch-black flex items-center justify-center font-bold text-xl hover:bg-white active:translate-y-1 border-b-4 border-glitch-magenta"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-white hover:text-glitch-cyan bg-glitch-gray p-2 border-2 border-glitch-gray hover:border-glitch-cyan active:translate-y-1"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Playlist */}
      <div className="mt-2">
        <h4 className="text-glitch-yellow text-lg mb-2 border-b-2 border-glitch-gray pb-1">>> BUFFER_QUEUE</h4>
        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-2">
          {PLAYLIST.map((track, index) => (
            <div 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={`flex justify-between items-center p-2 cursor-pointer border-l-4 ${
                index === currentTrackIndex 
                  ? 'bg-glitch-gray border-glitch-cyan text-glitch-cyan' 
                  : 'border-transparent hover:bg-glitch-gray/50 text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-lg truncate flex-1 uppercase">{index === currentTrackIndex ? '> ' : ''}{track.title}</span>
              <span className="text-sm ml-2 text-glitch-magenta">[{track.duration}]</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
