import React from 'react';
import { ArrowLeft, Droplets, Wind, Flame, Sword } from 'lucide-react';
import { Difficulty } from '../types/game';
import { soundFX } from '../utils/sound';

interface DifficultySelectModalProps {
  selectedPreview: Difficulty;
  onHoverDifficulty: (diff: Difficulty) => void;
  onSelectDifficulty: (diff: Difficulty) => void;
  onBackToGuidebook: () => void;
}

export const DifficultySelectModal: React.FC<DifficultySelectModalProps> = ({
  selectedPreview,
  onHoverDifficulty,
  onSelectDifficulty,
  onBackToGuidebook,
}) => {
  const modes = [
    {
      diff: Difficulty.EASY,
      label: 'EASY',
      bossName: 'TIDAL GUARDIAN',
      element: 'Elemen Air (Water)',
      icon: Droplets,
      accent: 'border-[#38bdf8]',
      titleColor: 'text-[#38bdf8]',
      damageToBoss: '25% HP Bos / Benar',
      penalty: 'Efek Slowness & Blindness (0% HP Karakter)',
      questionDesc: 'Konsep dasar unsur lingkaran, sudut pusat/keliling langsung, busur & garis singgung dasar.',
      scoreMult: 'Skor ×1.0',
    },
    {
      diff: Difficulty.MEDIUM,
      label: 'MEDIUM',
      bossName: 'TEMPEST SOVEREIGN',
      element: 'Elemen Angin (Wind)',
      icon: Wind,
      accent: 'border-[#6ee7b7]',
      titleColor: 'text-[#6ee7b7]',
      damageToBoss: '20% HP Bos / Benar',
      penalty: 'Darah Karakter -20% / Salah',
      questionDesc: 'Soal aljabar sudut pusat/keliling, keliling juring, luas tembereng, GSPL & GSPD.',
      scoreMult: 'Skor ×1.5',
    },
    {
      diff: Difficulty.HARD,
      label: 'HARD',
      bossName: 'MAGMA COLOSSUS',
      element: 'Elemen Magma (Lava)',
      icon: Flame,
      accent: 'border-[#f97316]',
      titleColor: 'text-[#f97316]',
      damageToBoss: '15% HP Bos / Benar',
      penalty: 'Slowness + Blindness & Darah Karakter -30%!',
      questionDesc: 'Analitik persamaan lingkaran & garis singgung, Teorema Ptolemeus, tali pengikat & kerucut.',
      scoreMult: 'Skor ×2.5',
    },
  ];

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4 sm:p-6 bg-black/75">
      <div className="pixel-panel-gold w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#271e19] border-b-4 border-[#c99738] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-pixel-title text-base sm:text-xl text-[#ffd166]">
              PILIH TINGKAT KESULITAN GLADIATOR 1 VS 1
            </h2>
            <p className="font-pixel-body text-xl text-[#d6c5b3]">
              Arahkan kursor untuk melihat wujud 3D Bos Elemen di belakang, lalu klik untuk bertarung!
            </p>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onBackToGuidebook();
            }}
            className="pixel-btn px-3 py-2 text-xs text-[#f4ebd9] flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE GUIDEBOOK</span>
          </button>
        </div>

        {/* 3 Mode Cards */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {modes.map((m) => {
            const Icon = m.icon;
            const isFocused = selectedPreview === m.diff;
            return (
              <div
                key={m.diff}
                onMouseEnter={() => onHoverDifficulty(m.diff)}
                className={`pixel-panel p-5 flex flex-col justify-between transition-transform duration-150 ${
                  isFocused ? `${m.accent} -translate-y-1` : 'border-[#4a3f55]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`font-pixel-title text-base ${m.titleColor}`}>
                      {m.label}
                    </span>
                    <Icon className={`w-6 h-6 ${m.titleColor}`} />
                  </div>

                  <div>
                    <div className="font-pixel-body text-2xl text-[#fff6e5] font-bold">
                      {m.bossName}
                    </div>
                    <div className="font-pixel-body text-lg text-[#cbd5e1]">
                      {m.element} · {m.scoreMult}
                    </div>
                  </div>

                  <div className="border-t-2 border-[#362d42] pt-3 space-y-2 font-pixel-body text-lg">
                    <p className="text-[#86efac]">
                      <strong>Serangan Benar:</strong> {m.damageToBoss}
                    </p>
                    <p className="text-[#fca5a5]">
                      <strong>Jika Salah:</strong> {m.penalty}
                    </p>
                    <p className="text-[#d8cee6] pt-1">{m.questionDesc}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFX.playClick();
                    onSelectDifficulty(m.diff);
                  }}
                  className="pixel-btn-primary w-full py-3 px-4 mt-5 text-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Sword className="w-4 h-4 shrink-0" />
                  <span>LAWAN {m.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
