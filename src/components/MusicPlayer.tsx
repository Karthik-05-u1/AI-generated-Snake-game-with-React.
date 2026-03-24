import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "DATA_STREAM_ALPHA", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "VOID_RESONANCE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "NULL_POINTER_EXCEPTION", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(() => {});
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  return (
    <div className="p-4 font-mono text-[#00FFFF] bg-black">
      <div className="border border-[#FF00FF] p-4 mb-6 relative">
        <div className="absolute -top-3 left-4 bg-black px-2 text-[#FF00FF]">CURRENT_STREAM</div>
        <h3 className="text-2xl glitch" data-text={currentTrack.title}>{currentTrack.title}</h3>
        <p className="text-sm mt-2 opacity-70">SECTOR: {currentTrackIndex + 1} / {TRACKS.length}</p>
        
        {isPlaying && (
          <div className="mt-4 flex gap-1 h-8 items-end">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="w-4 bg-[#00FFFF]" 
                style={{ 
                  height: `${Math.random() * 100}%`,
                  animation: `pulse ${0.5 + Math.random()}s infinite alternate`
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center border border-[#00FFFF] p-2">
          <button onClick={prevTrack} className="px-4 py-2 bg-[#FF00FF] text-black hover:bg-[#00FFFF] transition-none uppercase font-bold">
            &lt;&lt; PRV
          </button>
          <button onClick={togglePlay} className="px-8 py-2 bg-[#00FFFF] text-black hover:bg-[#FF00FF] transition-none uppercase font-bold text-xl">
            {isPlaying ? 'HALT' : 'EXEC'}
          </button>
          <button onClick={nextTrack} className="px-4 py-2 bg-[#FF00FF] text-black hover:bg-[#00FFFF] transition-none uppercase font-bold">
            NXT &gt;&gt;
          </button>
        </div>

        <div className="border border-[#FF00FF] p-2 flex items-center gap-4">
          <span className="text-[#FF00FF]">VOL:</span>
          <input 
            type="range" min="0" max="1" step="0.01" value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:bg-[#00FFFF] [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#FF00FF] [&::-webkit-slider-thumb]:-mt-2.5"
          />
          <span>{Math.round(volume * 100)}%</span>
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.url} onEnded={nextTrack} className="hidden" />
    </div>
  );
}
