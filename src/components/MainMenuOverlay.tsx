import React from 'react';
import { Sword, BookOpen, LogOut, Trophy, Volume2, VolumeX } from 'lucide-react';
import { soundFX } from '../utils/sound';

interface MainMenuOverlayProps {
  highScore: number;
  lastScore: number | null;
  muted: boolean;
  onToggleMute: () => void;
  onPlay: () => void;
  onHowToPlay: () => void;
  onQuit: () => void;
}

export const MainMenuOverlay: React.FC<MainMenuOverlayProps> = ({
  highScore,
  lastScore,
  muted,
  onToggleMute,
  onPlay,
  onHowToPlay,
  onQuit,
}) => {
  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-between py-8 px-6 pointer-events-none bg-gradient-to-b from-black/75 via-black/25 to-black/80">
      {/* Top Bar: Audio Toggle & High Score */}
      <div className="w-full max-w-5xl flex items-center justify-between pointer-events-auto">
        <div className="pixel-panel px-4 py-2 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-[#ffd166] shrink-0" />
          <span className="font-pixel-body text-xl text-[#f4ebd9] tabular-nums">
            SKOR TERTINGGI: <strong className="text-[#ffd166]">{highScore}</strong>
            {lastScore !== null ? `  ·  SKOR TERAKHIR: ${lastScore}` : ''}
          </span>
        </div>

        <button
          onClick={() => {
            onToggleMute();
          }}
          className="pixel-btn px-3 py-2 text-[#f4ebd9] flex items-center gap-2 text-xs whitespace-nowrap shrink-0 cursor-pointer"
          aria-label="Toggle Suara"
        >
          {muted ? <VolumeX className="w-4 h-4 text-[#f87171]" /> : <Volume2 className="w-4 h-4 text-[#4ade80]" />}
          <span>{muted ? 'SUARA: MATI' : 'SUARA: AKTIF'}</span>
        </button>
      </div>

      {/* Top-Center Hero Title + Menu Options as requested */}
      <div className="flex flex-col items-center text-center max-w-3xl pointer-events-auto my-auto">
        <p className="font-pixel-body text-xl md:text-2xl text-[#e89d3c] tracking-widest mb-2">
          PETUALANGAN GLADIATOR MATEMATIKA KELAS XI SMA
        </p>

        <h1
          className="font-pixel-title text-3xl sm:text-5xl md:text-6xl text-[#ffd166] leading-tight mb-3"
          style={{
            textShadow: '0 6px 0 #591b12, 0 10px 20px rgba(0,0,0,0.9)',
            textWrap: 'balance',
          }}
        >
          Dungeons &amp; Diameters
        </h1>

        <p className="font-pixel-body text-xl md:text-2xl text-[#d8cee6] max-w-xl mb-8">
          Kuasai Unsur Lingkaran, Sudut Pusat &amp; Keliling, Segi Empat Tali Busur, Panjang Busur, Luas Juring, dan Garis Singgung dengan Pedang Hitammu!
        </p>

        {/* Main 3 Menu Choices */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={() => {
              soundFX.playClick();
              onPlay();
            }}
            className="pixel-btn-primary py-4 px-6 text-sm md:text-base flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap"
          >
            <Sword className="w-5 h-5 shrink-0" />
            <span>Play</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onHowToPlay();
            }}
            className="pixel-btn py-4 px-6 text-sm md:text-base text-[#f4ebd9] flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-5 h-5 text-[#38bdf8] shrink-0" />
            <span>How To Play</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onQuit();
            }}
            className="pixel-btn py-4 px-6 text-sm md:text-base text-[#fca5a5] flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap"
          >
            <LogOut className="w-5 h-5 text-[#f87171] shrink-0" />
            <span>Quit The Game</span>
          </button>
        </div>
      </div>

      {/* Bottom Quiet Info */}
      <div className="font-pixel-body text-lg text-[#b3a4c4] text-center">
        Arena 3D Interaktif · Materi Lengkap Lingkaran Kelas XI SMA · Gunakan Laptop / Keyboard
      </div>
    </div>
  );
};
