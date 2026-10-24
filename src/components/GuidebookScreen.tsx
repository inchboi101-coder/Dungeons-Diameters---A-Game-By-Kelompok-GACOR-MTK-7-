import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Sword, CheckCircle2, BookMarked } from 'lucide-react';
import { GUIDEBOOK_CHAPTERS } from '../data/guidebookData';
import { CircleDiagram } from './CircleDiagram';
import { soundFX } from '../utils/sound';

interface GuidebookScreenProps {
  onBackToMenu: () => void;
  onFinishGuidebook: () => void;
}

export const GuidebookScreen: React.FC<GuidebookScreenProps> = ({
  onBackToMenu,
  onFinishGuidebook,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });

  const chapter = GUIDEBOOK_CHAPTERS[activeIdx];
  const visitedCount = Object.keys(visited).length;

  const selectChapter = (idx: number) => {
    soundFX.playPageFlip();
    setActiveIdx(idx);
    setVisited((prev) => ({ ...prev, [idx]: true }));
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-3 sm:p-6 bg-black/82">
      <div className="pixel-panel-gold w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-[#271e19] border-b-4 border-[#c99738] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookMarked className="w-6 h-6 text-[#ffd166] shrink-0" />
            <div>
              <h2 className="font-pixel-title text-sm sm:text-base text-[#ffd166]">
                GUIDEBOOK GEOMETRI LINGKARAN — KELAS XI SMA
              </h2>
              <p className="font-pixel-body text-lg text-[#d6c5b3]">
                Pelajari ke-6 materi lingkaran sebelum memilih tingkat kesulitan Bos Dungeon ({visitedCount}/6 Bab Dibaca)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onBackToMenu();
            }}
            className="pixel-btn px-3 py-2 text-xs text-[#f4ebd9] flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>MENU UTAMA</span>
          </button>
        </div>

        {/* Chapter Tabs */}
        <div className="px-4 py-2.5 bg-[#19141d] border-b-2 border-[#4a3f55] flex items-center gap-2 overflow-x-auto">
          {GUIDEBOOK_CHAPTERS.map((chap, idx) => {
            const isActive = idx === activeIdx;
            const isRead = !!visited[idx];
            return (
              <button
                key={chap.id}
                onClick={() => selectChapter(idx)}
                className={`px-3 py-2 font-pixel-body text-lg border-2 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#8f3224] border-[#ffd166] text-[#fff6e5]'
                    : 'bg-[#241d2b] border-[#4a3f55] text-[#c7bad6] hover:border-[#c99738]'
                }`}
              >
                <span>
                  {chap.number}: {chap.title}
                </span>
                {isRead && <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Concept + Formulas */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="font-pixel-body text-lg text-[#e89d3c]">
                {chapter.number} · MATERI INTI KELAS XI
              </div>
              <h3 className="font-pixel-title text-lg sm:text-xl text-[#ffd166] mt-1">
                {chapter.title}
              </h3>
              <p className="font-pixel-body text-xl text-[#cbd5e1] mt-1">{chapter.subtitle}</p>
            </div>

            <p className="font-pixel-body text-xl leading-relaxed text-[#f4ebd9] bg-[#141019] p-4 border-2 border-[#3b3147]">
              {chapter.summary}
            </p>

            {/* Key Formulas */}
            <div className="space-y-3">
              <h4 className="font-pixel-title text-xs text-[#38bdf8]">
                RUMUS &amp; TEOREMA PENTING
              </h4>
              <div className="space-y-3">
                {chapter.formulas.map((f, i) => (
                  <div
                    key={i}
                    className="bg-[#16121c] border-2 border-[#5b4c6e] p-3.5 space-y-1"
                  >
                    <div className="font-pixel-body text-lg text-[#c4b5fd]">{f.label}</div>
                    <div className="font-pixel-body text-2xl text-[#ffd166] tracking-wide">
                      {f.formula}
                    </div>
                    {f.note && (
                      <div className="font-pixel-body text-lg text-[#a395b5]">{f.note}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Visual Diagram + Key Points + Worked Example */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <h4 className="font-pixel-title text-xs text-[#e89d3c]">
                ILUSTRASI GEOMETRI
              </h4>
              <CircleDiagram type={chapter.diagramType} />
            </div>

            <div className="bg-[#141019] border-2 border-[#3b3147] p-4 space-y-2">
              <h4 className="font-pixel-title text-xs text-[#4ade80]">POIN KUNCI</h4>
              <ul className="space-y-1.5 font-pixel-body text-lg text-[#e2d8f0]">
                {chapter.keyPoints.map((pt, i) => (
                  <li key={i}>• {pt}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1f1714] border-2 border-[#c99738] p-4 space-y-2">
              <h4 className="font-pixel-title text-xs text-[#ffd166]">
                CONTOH SOAL &amp; PEMBAHASAN
              </h4>
              <p className="font-pixel-body text-lg text-[#fff6e5]">
                <strong>Soal:</strong> {chapter.example.problem}
              </p>
              <p className="font-pixel-body text-lg text-[#86efac]">
                <strong>Pembahasan:</strong> {chapter.example.solution}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="px-5 py-3.5 bg-[#271e19] border-t-4 border-[#c99738] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => selectChapter(Math.max(0, activeIdx - 1))}
              disabled={activeIdx === 0}
              className="pixel-btn px-3 py-2 text-xs text-[#f4ebd9] disabled:opacity-40 flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>BAB SEBELUMNYA</span>
            </button>

            <button
              onClick={() =>
                selectChapter(Math.min(GUIDEBOOK_CHAPTERS.length - 1, activeIdx + 1))
              }
              disabled={activeIdx === GUIDEBOOK_CHAPTERS.length - 1}
              className="pixel-btn px-3 py-2 text-xs text-[#f4ebd9] disabled:opacity-40 flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>BAB BERIKUTNYA</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onFinishGuidebook();
            }}
            className="pixel-btn-primary px-5 py-3 text-xs sm:text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Sword className="w-4 h-4 shrink-0" />
            <span>SELESAI MEMBACA — PILIH DIFFICULTY BOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
