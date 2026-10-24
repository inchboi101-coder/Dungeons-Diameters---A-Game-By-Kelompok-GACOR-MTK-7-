import React from 'react';
import { Trophy, Skull, RotateCcw, Home } from 'lucide-react';
import { BattleStats, Difficulty } from '../types/game';
import { soundFX } from '../utils/sound';

interface ResultOverlayProps {
  victory: boolean;
  difficulty: Difficulty;
  stats: BattleStats;
  onReturnMainMenu: () => void;
  onRetryDifficulty?: () => void;
}

export const ResultOverlay: React.FC<ResultOverlayProps> = ({
  victory,
  difficulty,
  stats,
  onReturnMainMenu,
  onRetryDifficulty,
}) => {
  const totalAnswered = stats.correctCount + stats.wrongCount;
  const accuracy =
    totalAnswered > 0 ? Math.round((stats.correctCount / totalAnswered) * 100) : 0;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/82">
      <div className="pixel-panel-gold w-full max-w-lg p-6 sm:p-8 text-center space-y-6">
        <div className="flex justify-center">
          {victory ? (
            <Trophy className="w-16 h-16 text-[#ffd166]" />
          ) : (
            <Skull className="w-16 h-16 text-[#f87171]" />
          )}
        </div>

        <div className="space-y-2">
          <p className="font-pixel-body text-xl text-[#e89d3c]">
            MODE {difficulty} · GLADIATOR SELESAI
          </p>
          <h2
            className={`font-pixel-title text-2xl sm:text-3xl ${
              victory ? 'text-[#4ade80]' : 'text-[#f87171]'
            }`}
          >
            {victory ? 'BOS DIKALAHKAN!' : 'KSATRIA TUMBANG!'}
          </h2>
          <p className="font-pixel-body text-xl text-[#e2d8f0]">
            {victory
              ? 'Tebasan Pedang Hitam dan penguasaan rumus Lingkaran Kelas XI milikmu berhasil menaklukkan penjaga dungeon!'
              : 'Jangan menyerah! Pelajari kembali rumus di Guidebook dan tantang kembali Bos Dungeon.'}
          </p>
        </div>

        {/* Final Score Breakdown */}
        <div className="pixel-panel p-4 space-y-2 font-pixel-body text-2xl text-left tabular-nums">
          <div className="flex justify-between">
            <span className="text-[#cbd5e1]">Total Skor Akhir:</span>
            <strong className="text-[#ffd166]">{stats.score} Poin</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#cbd5e1]">Jawaban Benar:</span>
            <strong className="text-[#4ade80]">{stats.correctCount} Soal</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#cbd5e1]">Akurasi Matematika:</span>
            <strong className="text-[#38bdf8]">{accuracy}%</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#cbd5e1]">Sisa HP Ksatria:</span>
            <strong className="text-[#fca5a5]">{Math.max(0, stats.playerHp)}%</strong>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {!victory && onRetryDifficulty && (
            <button
              onClick={() => {
                soundFX.playClick();
                onRetryDifficulty();
              }}
              className="pixel-btn px-5 py-3.5 text-xs text-[#f4ebd9] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>COBA LAGI</span>
            </button>
          )}

          <button
            onClick={() => {
              soundFX.playClick();
              onReturnMainMenu();
            }}
            className="pixel-btn-primary px-6 py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap flex-1"
          >
            <Home className="w-4 h-4" />
            <span>KEMBALI KE TAMPILAN AWAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
