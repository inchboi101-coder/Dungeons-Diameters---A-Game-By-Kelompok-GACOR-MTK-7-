import React, { useState } from 'react';
import { Sword, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Difficulty, MathQuestion } from '../types/game';
import { CircleDiagram } from './CircleDiagram';
import { soundFX } from '../utils/sound';

interface MathQuestionModalProps {
  question: MathQuestion;
  difficulty: Difficulty;
  onSubmitAnswer: (isCorrect: boolean) => void;
  onCancel: () => void;
}

export const MathQuestionModal: React.FC<MathQuestionModalProps> = ({
  question,
  difficulty,
  onSubmitAnswer,
  onCancel,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleChoose = (idx: number) => {
    if (revealed) return;
    soundFX.playClick();
    setSelectedIdx(idx);
    setRevealed(true);
  };

  const isCorrect = selectedIdx === question.correctIndex;

  const damageLabel =
    difficulty === Difficulty.EASY
      ? '-25% HP Bos'
      : difficulty === Difficulty.MEDIUM
        ? '-20% HP Bos'
        : '-15% HP Bos';

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/78">
      <div className="pixel-panel-gold w-full max-w-3xl overflow-hidden">
        {/* Top Bar */}
        <div className="px-5 py-3.5 bg-[#271e19] border-b-4 border-[#c99738] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sword className="w-5 h-5 text-[#ffd166] shrink-0" />
            <span className="font-pixel-title text-xs sm:text-sm text-[#ffd166]">
              MANTERA PEDANG HITAM · {question.topic.toUpperCase()}
            </span>
          </div>
          <span className="font-pixel-body text-lg text-[#86efac] whitespace-nowrap">
            Target: {damageLabel}
          </span>
        </div>

        {/* Question Content */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className={question.diagramType ? 'md:col-span-8 space-y-4' : 'md:col-span-12 space-y-4'}>
              <p className="font-pixel-body text-2xl leading-snug text-[#fff6e5]">
                {question.question}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  let styleClass =
                    'bg-[#221b29] border-[#5b4c6e] text-[#f4ebd9] hover:border-[#ffd166]';

                  if (revealed) {
                    if (idx === question.correctIndex) {
                      styleClass = 'bg-[#143824] border-[#4ade80] text-[#bbf7d0]';
                    } else if (idx === selectedIdx) {
                      styleClass = 'bg-[#45171b] border-[#f87171] text-[#fecaca]';
                    } else {
                      styleClass = 'bg-[#19141f] border-[#352c40] text-[#7c6f8c]';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={revealed}
                      onClick={() => handleChoose(idx)}
                      className={`p-3.5 border-3 text-left font-pixel-body text-xl flex items-center gap-3 transition-colors cursor-pointer ${styleClass}`}
                    >
                      <span className="font-pixel-title text-xs px-2 py-1 bg-black/40 text-[#ffd166] shrink-0">
                        {letter}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {question.diagramType && (
              <div className="md:col-span-4">
                <CircleDiagram type={question.diagramType} />
              </div>
            )}
          </div>

          {/* Feedback & Explanation before executing 3D Slash */}
          {revealed && (
            <div
              className={`p-4 border-2 ${
                isCorrect
                  ? 'bg-[#11291c] border-[#4ade80] text-[#dcfce7]'
                  : 'bg-[#361417] border-[#f87171] text-[#fee2e2]'
              }`}
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 font-pixel-title text-xs">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-[#4ade80] shrink-0" />
                      <span className="text-[#4ade80]">
                        JAWABAN BENAR! PEDANG HITAM SIap MENEBAS!
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-[#f87171] shrink-0" />
                      <span className="text-[#f87171]">
                        JAWABAN KURANG TEPAT! AWAS SERANGAN BALASAN BOS!
                      </span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => onSubmitAnswer(isCorrect)}
                  className="pixel-btn-primary px-4 py-2.5 text-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isCorrect ? 'LANCARKAN TEBASAN!' : 'TERIMA DAMPAK'}</span>
                </button>
              </div>
              <p className="font-pixel-body text-xl mt-2">{question.explanation}</p>
            </div>
          )}

          {!revealed && (
            <div className="flex items-center justify-between pt-1">
              <span className="font-pixel-body text-lg text-[#b3a4c4]">
                Pilih salah satu jawaban yang tepat untuk mengayunkan Black Sword.
              </span>
              <button
                onClick={() => {
                  soundFX.playClick();
                  onCancel();
                }}
                className="pixel-btn px-3 py-2 text-xs text-[#cbd5e1] cursor-pointer whitespace-nowrap"
              >
                MUNDUR DULU
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
