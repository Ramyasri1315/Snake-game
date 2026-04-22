import React, { useState } from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { Track } from './types';

const App: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  return (
    <div className="min-h-screen bg-glitch-black text-white font-mono relative overflow-hidden flex flex-col crt-flicker">
      
      {/* Glitch Overlays */}
      <div className="bg-noise"></div>
      <div className="scanlines"></div>

      {/* Header */}
      <header className="relative z-10 p-6 text-center border-b-4 border-glitch-magenta bg-glitch-dark screen-tear">
        <h1 className="text-5xl md:text-7xl font-black tracking-widest">
          <span className="glitch-text text-white" data-text="SYS.SNAKE // AUDIO.EXEC">
            SYS.SNAKE // AUDIO.EXEC
          </span>
        </h1>
        <div className="mt-4 flex justify-center items-center gap-4 text-glitch-cyan text-xl">
          <span>STATUS: {currentTrack ? 'STREAMING' : 'IDLE'}</span>
          <span className="w-2 h-2 bg-glitch-magenta animate-ping"></span>
          <span>{currentTrack ? `[${currentTrack.title}]` : '[AWAITING_DATA]'}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 p-4 md:p-8">
        
        {/* Left/Top: Game */}
        <div className="flex-1 flex justify-center items-center w-full max-w-2xl">
          <SnakeGame />
        </div>

        {/* Right/Bottom: Music Player */}
        <div className="w-full lg:w-auto flex justify-center items-center">
          <MusicPlayer onTrackChange={setCurrentTrack} />
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-lg text-glitch-yellow border-t-2 border-glitch-cyan bg-glitch-dark">
        <p className="glitch-text" data-text="INPUT: [W,A,S,D] OR [ARROWS] | INTERRUPT: [SPACE]">
          INPUT: [W,A,S,D] OR [ARROWS] | INTERRUPT: [SPACE]
        </p>
      </footer>
    </div>
  );
};

export default App;
