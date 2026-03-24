import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00FFFF] font-mono relative overflow-hidden flex flex-col screen-tear">
      <div className="static-noise"></div>
      <div className="scanlines"></div>

      <header className="relative z-10 w-full p-4 border-b-4 border-[#FF00FF] bg-black flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter glitch" data-text="SYS.OP.SNAKE_AUDIO">
            SYS.OP.SNAKE_AUDIO
          </h1>
          <p className="text-[#FF00FF] text-xl mt-1">STATUS: ONLINE // V.1.0.9</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-sm">UPLINK_ESTABLISHED</p>
          <p className="text-sm animate-pulse">AWAITING_INPUT...</p>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full p-4 md:p-8 flex flex-col lg:flex-row items-start justify-center gap-8">
        <div className="w-full lg:w-1/2 border-2 border-[#00FFFF] p-1 bg-black relative">
          <div className="absolute top-0 left-0 bg-[#00FFFF] text-black px-2 py-1 text-sm font-bold">MODULE.01::SNAKE_PROTOCOL</div>
          <div className="mt-8">
            <SnakeGame />
          </div>
        </div>

        <div className="w-full lg:w-1/2 border-2 border-[#FF00FF] p-1 bg-black relative">
          <div className="absolute top-0 right-0 bg-[#FF00FF] text-black px-2 py-1 text-sm font-bold">MODULE.02::AUDIO_STREAM</div>
          <div className="mt-8">
            <MusicPlayer />
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-2 border-t-2 border-[#00FFFF] text-center text-sm bg-black">
        <span className="glitch" data-text="END_OF_LINE">END_OF_LINE</span>
      </footer>
    </div>
  );
}
