import React from 'react';
import { ArrowLeft, Move, Sword, ShieldAlert, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/sound';

interface HowToPlayModalProps {
  onBack: () => void;
  onStartPlay: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onBack, onStartPlay }) => {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4 md:p-8 bg-black/80">
      <div className="pixel-panel-gold w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#271e19] border-b-4 border-[#c99738] flex items-center justify-between gap-4">
          <h2 className="font-pixel-title text-lg md:text-xl text-[#ffd166]">
            HOW TO PLAY — PANDUAN PETUALANGAN
          </h2>
          <button
            onClick={() => {
              soundFX.playClick();
              onBack();
            }}
            className="pixel-btn px-3 py-2 text-xs text-[#f4ebd9] flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI</span>
          </button>
        </div>

        {/* Scrollable Tutorial Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-pixel-body text-xl leading-relaxed text-[#f4ebd9]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Step 1: Pergerakan */}
            <div className="pixel-panel p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#38bdf8] font-pixel-title text-xs">
                <Move className="w-4 h-4 shrink-0" />
                <span>1. CARA BERGERAK DI ARENA 3D</span>
              </div>
              <p className="text-xl text-[#e2d8f0]">
                Gunakan tombol <strong className="text-[#ffd166]">W, A, S, D</strong> atau{' '}
                <strong className="text-[#ffd166]">Tombol Panah (Arrow Keys)</strong> pada keyboard laptop untuk menggerakkan ksatria berpedang hitam mengelilingi Arena Lingkaran.
              </p>
            </div>

            {/* Step 2: Menyerang Bos */}
            <div className="pixel-panel p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#fb923c] font-pixel-title text-xs">
                <Sword className="w-4 h-4 shrink-0" />
                <span>2. CARA MENYERANG BOS DUNGEON</span>
              </div>
              <p className="text-xl text-[#e2d8f0]">
                Dekati Bos hingga indikator serangan menyala, lalu tekan{' '}
                <strong className="text-[#ffd166]">SPACE / E</strong> atau klik tombol{' '}
                <strong className="text-[#ffd166]">SERANG BOS</strong>. Akan muncul tantangan soal Matematika Lingkaran Kelas XI!
              </p>
            </div>
          </div>

          {/* Step 3: Guidebook & Alur */}
          <div className="pixel-panel p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#4ade80] font-pixel-title text-xs">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>3. GUIDEBOOK LINGKARAN &amp; SKOR GLADIATOR</span>
            </div>
            <p className="text-xl text-[#e2d8f0]">
              Saat menekan <strong className="text-[#ffd166]">Play</strong>, kamu akan membuka{' '}
              <strong className="text-[#ffd166]">Codex Guidebook Lingkaran Kelas XI SMA</strong> berisi 6 Bab lengkap (Unsur Lingkaran, Sudut Pusat &amp; Keliling, Segi Empat Tali Busur, Panjang Busur, Luas Juring, dan Garis Singgung). Pelajari rumusnya, pilih tingkat kesulitan, lalu kalahkan Bos untuk meraih skor tertinggi!
            </p>
          </div>

          {/* Step 4: Aturan 3 Mode Difficulty */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#f87171] font-pixel-title text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>4. ATURAN 3 TINGKAT KESULITAN &amp; EFEK ELEMEN BOS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="pixel-panel p-4 border-[#38bdf8]">
                <h3 className="font-pixel-title text-xs text-[#38bdf8] mb-2">
                  EASY — BOS AIR
                </h3>
                <p className="text-lg text-[#d8cee6]">
                  · Jawaban Benar: Darah Bos <strong className="text-[#4ade80]">-25%</strong> (4 tebasan menang).
                  <br />· Jawaban Salah: Terkena tebasan air &amp; efek{' '}
                  <strong className="text-[#7dd3fc]">Slowness + Blindness</strong> (tanpa pengurangan HP).
                </p>
              </div>

              <div className="pixel-panel p-4 border-[#6ee7b7]">
                <h3 className="font-pixel-title text-xs text-[#6ee7b7] mb-2">
                  MEDIUM — BOS ANGIN
                </h3>
                <p className="text-lg text-[#d8cee6]">
                  · Jawaban Benar: Darah Bos <strong className="text-[#4ade80]">-20%</strong> (5 tebasan menang).
                  <br />· Jawaban Salah: Terkena tebasan badai angin &amp; Darah Karakter{' '}
                  <strong className="text-[#f87171]">-20%</strong>.
                </p>
              </div>

              <div className="pixel-panel p-4 border-[#f97316]">
                <h3 className="font-pixel-title text-xs text-[#f97316] mb-2">
                  HARD — BOS MAGMA
                </h3>
                <p className="text-lg text-[#d8cee6]">
                  · Jawaban Benar: Darah Bos <strong className="text-[#4ade80]">-15%</strong> (7 tebasan menang).
                  <br />· Jawaban Salah: Efek{' '}
                  <strong className="text-[#fdba74]">Slowness + Blindness</strong> &amp; Darah Karakter{' '}
                  <strong className="text-[#f87171]">-30%</strong>!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#271e19] border-t-4 border-[#c99738] flex items-center justify-between gap-4">
          <span className="font-pixel-body text-lg text-[#d6c5b3]">
            Siap menguji ketajaman geometri dan pedang hitammu?
          </span>
          <button
            onClick={() => {
              soundFX.playClick();
              onStartPlay();
            }}
            className="pixel-btn-primary px-5 py-3 text-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            BUKA GUIDEBOOK &amp; MAIN
          </button>
        </div>
      </div>
    </div>
  );
};
