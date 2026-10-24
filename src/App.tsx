/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BattleStats, Difficulty, GameScreen, MathQuestion } from './types/game';
import { MATH_QUESTIONS } from './data/questionsData';
import { ArenaScene, ArenaSceneHandle } from './three/ArenaScene';
import { MainMenuOverlay } from './components/MainMenuOverlay';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GuidebookScreen } from './components/GuidebookScreen';
import { DifficultySelectModal } from './components/DifficultySelectModal';
import { BattleHUD } from './components/BattleHUD';
import { MathQuestionModal } from './components/MathQuestionModal';
import { ResultOverlay } from './components/ResultOverlay';
import { soundFX } from './utils/sound';
import { RotateCcw, Trophy } from 'lucide-react';

const INITIAL_STATS: BattleStats = {
  playerHp: 100,
  maxPlayerHp: 100,
  bossHp: 100,
  maxBossHp: 100,
  score: 0,
  streak: 0,
  correctCount: 0,
  wrongCount: 0,
  slownessLeft: 0,
  blindnessLeft: 0,
  inAttackRange: false,
  isAnimatingAction: false,
};

export default function App() {
  const [screen, setScreen] = useState<GameScreen>(GameScreen.MAIN_MENU);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [muted, setMuted] = useState(false);

  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dungeons_diameters_highscore');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [lastScore, setLastScore] = useState<number | null>(null);

  const [stats, setStats] = useState<BattleStats>(INITIAL_STATS);
  const [activeQuestion, setActiveQuestion] = useState<MathQuestion | null>(null);
  const [quickGuideOpen, setQuickGuideOpen] = useState(false);
  const [combatBanner, setCombatBanner] = useState<string | null>(null);

  const usedQuestionIdsRef = useRef<Set<string>>(new Set());
  const arenaRef = useRef<ArenaSceneHandle | null>(null);

  const updateHighScore = useCallback((finalScore: number) => {
    setLastScore(finalScore);
    setHighScore((prev) => {
      const next = Math.max(prev, finalScore);
      try {
        localStorage.setItem('dungeons_diameters_highscore', String(next));
      } catch {
        // ignore storage errors in restricted iframes
      }
      return next;
    });
  }, []);

  // Tick down Slowness & Blindness debuff timers during battle
  useEffect(() => {
    if (screen !== GameScreen.BATTLE) return;
    const interval = window.setInterval(() => {
      setStats((prev) => {
        if (prev.slownessLeft <= 0 && prev.blindnessLeft <= 0) return prev;
        return {
          ...prev,
          slownessLeft: Math.max(0, +(prev.slownessLeft - 0.25).toFixed(2)),
          blindnessLeft: Math.max(0, +(prev.blindnessLeft - 0.25).toFixed(2)),
        };
      });
    }, 250);
    return () => clearInterval(interval);
  }, [screen]);

  const showBanner = (msg: string) => {
    setCombatBanner(msg);
    window.setTimeout(() => {
      setCombatBanner((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const startBattleWithDifficulty = (selectedDiff: Difficulty) => {
    setDifficulty(selectedDiff);
    usedQuestionIdsRef.current.clear();
    setActiveQuestion(null);
    setQuickGuideOpen(false);
    setStats({
      ...INITIAL_STATS,
      inAttackRange: false,
      isAnimatingAction: false,
    });
    arenaRef.current?.resetPositions();
    setScreen(GameScreen.BATTLE);
    showBanner('DEKATI BOS DENGAN WASD LALU TEKAN SPACE UNTUK MENYERANG!');
  };

  const pickNextQuestion = (diff: Difficulty): MathQuestion => {
    const pool = MATH_QUESTIONS.filter((q) => q.difficulty === diff);
    let available = pool.filter((q) => !usedQuestionIdsRef.current.has(q.id));
    if (available.length === 0) {
      usedQuestionIdsRef.current.clear();
      available = pool;
    }
    const chosen = available[Math.floor(Math.random() * available.length)];
    usedQuestionIdsRef.current.add(chosen.id);
    return chosen;
  };

  const handleRequestAttack = useCallback(() => {
    if (screen !== GameScreen.BATTLE) return;
    if (activeQuestion || quickGuideOpen) return;
    setStats((prev) => {
      if (prev.isAnimatingAction || !prev.inAttackRange) return prev;
      const nextQ = pickNextQuestion(difficulty);
      setActiveQuestion(nextQ);
      return prev;
    });
  }, [screen, activeQuestion, quickGuideOpen, difficulty]);

  const handleAnswerResult = (isCorrect: boolean) => {
    setActiveQuestion(null);
    setStats((prev) => ({ ...prev, isAnimatingAction: true }));

    const mult =
      difficulty === Difficulty.EASY ? 1 : difficulty === Difficulty.MEDIUM ? 1.5 : 2.5;

    if (isCorrect) {
      // Exact Boss HP Reduction per Prompt Specification:
      // Easy = 25%, Medium = 20%, Hard = 15%
      const bossDamage =
        difficulty === Difficulty.EASY ? 25 : difficulty === Difficulty.MEDIUM ? 20 : 15;

      arenaRef.current?.triggerHeroAttack(
        () => {
          soundFX.playSwordSlash();
          setStats((prev) => {
            const nextStreak = prev.streak + 1;
            const gained = Math.round((150 + nextStreak * 30) * mult);
            const nextBossHp = Math.max(0, prev.bossHp - bossDamage);
            showBanner(`TEBASAN PEDANG HITAM! DARAH BOS -${bossDamage}% (+${gained} SKOR)`);
            return {
              ...prev,
              bossHp: nextBossHp,
              streak: nextStreak,
              correctCount: prev.correctCount + 1,
              score: prev.score + gained,
            };
          });
        },
        () => {
          setStats((prev) => {
            if (prev.bossHp <= 0) {
              const victoryBonus = Math.round(500 * mult + prev.playerHp * 3);
              const totalFinalScore = prev.score + victoryBonus;
              soundFX.playVictoryFanfare();
              updateHighScore(totalFinalScore);
              setScreen(GameScreen.VICTORY);
              return {
                ...prev,
                score: totalFinalScore,
                isAnimatingAction: false,
              };
            }
            return { ...prev, isAnimatingAction: false };
          });
        },
      );
    } else {
      // Exact Wrong Answer Penalties + Boss Slashing Animation per Prompt Specification:
      // Easy: Slowness & Blindness (0% HP damage)
      // Medium: Character HP -20%
      // Hard: Slowness, Blindness, AND Character HP -30%
      arenaRef.current?.triggerBossSlash(
        () => {
          soundFX.playBossSlash();
          setStats((prev) => {
            let hpLoss = 0;
            let addSlow = prev.slownessLeft;
            let addBlind = prev.blindnessLeft;

            if (difficulty === Difficulty.EASY) {
              addSlow = 9;
              addBlind = 9;
              showBanner('SERANGAN AIR BOS! TERKENA SLOWNESS & BLINDNESS!');
            } else if (difficulty === Difficulty.MEDIUM) {
              hpLoss = 20;
              showBanner('TEBASAN BADAI ANGIN BOS! DARAH KARAKTER -20%!');
            } else {
              hpLoss = 30;
              addSlow = 10;
              addBlind = 10;
              showBanner('TEBASAN MAGMA BOS! DARAH -30% + SLOWNESS & BLINDNESS!');
            }

            const nextPlayerHp = Math.max(0, prev.playerHp - hpLoss);
            return {
              ...prev,
              playerHp: nextPlayerHp,
              streak: 0,
              wrongCount: prev.wrongCount + 1,
              slownessLeft: addSlow,
              blindnessLeft: addBlind,
            };
          });
        },
        () => {
          setStats((prev) => {
            if (prev.playerHp <= 0) {
              soundFX.playDefeat();
              updateHighScore(prev.score);
              setScreen(GameScreen.DEFEAT);
              return { ...prev, isAnimatingAction: false };
            }
            return { ...prev, isAnimatingAction: false };
          });
        },
      );
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#0b090e]">
      {/* Always-mounted 3D WebGL Dungeon Gladiator World */}
      <ArenaScene
        ref={arenaRef}
        screen={screen}
        difficulty={difficulty}
        isQuestionOpen={!!activeQuestion || quickGuideOpen}
        slownessActive={stats.slownessLeft > 0}
        onRangeChange={(inRange) =>
          setStats((prev) =>
            prev.inAttackRange === inRange ? prev : { ...prev, inAttackRange: inRange },
          )
        }
        onRequestAttack={handleRequestAttack}
      />

      {/* 1. INITIAL MAIN MENU SCREEN ("Dungeons & Diameters", Play, How To Play, Quit The Game) */}
      {screen === GameScreen.MAIN_MENU && (
        <MainMenuOverlay
          highScore={highScore}
          lastScore={lastScore}
          muted={muted}
          onToggleMute={() => {
            soundFX.muted = !muted;
            setMuted(!muted);
          }}
          onPlay={() => setScreen(GameScreen.GUIDEBOOK)}
          onHowToPlay={() => setScreen(GameScreen.HOW_TO_PLAY)}
          onQuit={() => setScreen(GameScreen.QUIT)}
        />
      )}

      {/* 2. HOW TO PLAY TUTORIAL MODAL */}
      {screen === GameScreen.HOW_TO_PLAY && (
        <HowToPlayModal
          onBack={() => setScreen(GameScreen.MAIN_MENU)}
          onStartPlay={() => setScreen(GameScreen.GUIDEBOOK)}
        />
      )}

      {/* 3. COMPLETE GRADE XI CIRCLE GUIDEBOOK (Shown upon clicking Play) */}
      {screen === GameScreen.GUIDEBOOK && (
        <GuidebookScreen
          onBackToMenu={() => setScreen(GameScreen.MAIN_MENU)}
          onFinishGuidebook={() => setScreen(GameScreen.DIFFICULTY_SELECT)}
        />
      )}

      {/* 4. DIFFICULTY SELECTION (Easy Water, Medium Wind, Hard Magma) */}
      {screen === GameScreen.DIFFICULTY_SELECT && (
        <DifficultySelectModal
          selectedPreview={difficulty}
          onHoverDifficulty={(diff) => setDifficulty(diff)}
          onSelectDifficulty={startBattleWithDifficulty}
          onBackToGuidebook={() => setScreen(GameScreen.GUIDEBOOK)}
        />
      )}

      {/* 5. ACTIVE 3D GLADIATOR BOSS BATTLE HUD */}
      {screen === GameScreen.BATTLE && (
        <BattleHUD
          difficulty={difficulty}
          stats={stats}
          combatBanner={combatBanner}
          onTriggerAttack={handleRequestAttack}
          onOpenQuickGuide={() => setQuickGuideOpen(true)}
          onRetreatToMenu={() => {
            updateHighScore(stats.score);
            setScreen(GameScreen.MAIN_MENU);
          }}
        />
      )}

      {/* Quick In-Battle Reference Guidebook Modal */}
      {screen === GameScreen.BATTLE && quickGuideOpen && (
        <GuidebookScreen
          onBackToMenu={() => setQuickGuideOpen(false)}
          onFinishGuidebook={() => setQuickGuideOpen(false)}
        />
      )}

      {/* Math Question UI Popup when attacking Boss */}
      {screen === GameScreen.BATTLE && activeQuestion && (
        <MathQuestionModal
          question={activeQuestion}
          difficulty={difficulty}
          onSubmitAnswer={handleAnswerResult}
          onCancel={() => setActiveQuestion(null)}
        />
      )}

      {/* 6. VICTORY / DEFEAT SUMMARY -> Returns Player to Initial Main Menu */}
      {(screen === GameScreen.VICTORY || screen === GameScreen.DEFEAT) && (
        <ResultOverlay
          victory={screen === GameScreen.VICTORY}
          difficulty={difficulty}
          stats={stats}
          onReturnMainMenu={() => setScreen(GameScreen.MAIN_MENU)}
          onRetryDifficulty={() => startBattleWithDifficulty(difficulty)}
        />
      )}

      {/* 7. QUIT THE GAME SCREEN (Safe iFrame Exit Screen with Re-enter Button) */}
      {screen === GameScreen.QUIT && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-[#09070c]/95">
          <div className="pixel-panel-gold max-w-md w-full p-8 text-center space-y-6">
            <h2 className="font-pixel-title text-xl text-[#ffd166]">
              TERIMA KASIH TELAH BERMAIN!
            </h2>
            <p className="font-pixel-body text-2xl text-[#e2d8f0]">
              Kamu telah keluar dari sesi petualangan <strong>Dungeons &amp; Diameters</strong>. Semoga semakin mahir menguasai materi Lingkaran Kelas XI SMA!
            </p>
            <div className="pixel-panel p-4 flex items-center justify-center gap-3 font-pixel-body text-2xl text-[#ffd166] tabular-nums">
              <Trophy className="w-5 h-5 shrink-0" />
              <span>SKOR TERTINGGI: {highScore}</span>
            </div>
            <button
              onClick={() => {
                soundFX.playClick();
                setScreen(GameScreen.MAIN_MENU);
              }}
              className="pixel-btn-primary w-full py-3.5 px-6 text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>MASUK KEMBALI KE GAME</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
