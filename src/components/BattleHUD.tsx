import React, { useState } from 'react';
import {
  Sword,
  BookOpen,
  EyeOff,
  Snowflake,
  ChevronDown,
  ChevronUp,
  Flag,
  Heart,
  Skull,
  Trophy,
} from 'lucide-react';
import { BattleStats, Difficulty } from '../types/game';
import { soundFX } from '../utils/sound';

interface BattleHUDProps {
  difficulty: Difficulty;
  stats: BattleStats;
  combatBanner: string | null;
  onTriggerAttack: () => void;
  onOpenQuickGuide: () => void;
  onRetreatToMenu: () => void;
}

export const BattleHUD: React.FC<BattleHUDProps> = ({
  difficulty,
  stats,
  combatBanner,
  onTriggerAttack,
  onOpenQuickGuide,
  onRetreatToMenu,
}) => {
  const [dockCollapsed, setDockCollapsed] = useState(false);

  const bossMeta =
    difficulty === Difficulty.EASY
      ? {
          name: 'TIDAL GUARDIAN — BOS AIR',
          barColor: 'bg-[#0ea5e9]',
          border: 'border-[#38bdf8]',
        }
      : difficulty === Difficulty.MEDIUM
        ? {
            name: 'TEMPEST SOVEREIGN — BOS ANGIN',
            barColor: 'bg-[#10b981]',
            border: 'border-[#6ee7b7]',
          }
        : {
            name: 'MAGMA COLOSSUS — BOS MAGMA',
            barColor: 'bg-[#ea580c]',
            border: 'border-[#f97316]',
          };

  const bossPct = Math.max(0, Math.round((stats.bossHp / stats.maxBossHp) * 100));
  const playerPct = Math.max(0, Math.round((stats.playerHp / stats.maxPlayerHp) * 100));

  return (
    <>
      {/* BLINDNESS DEBUFF DARKNESS VIGNETTE OVERLAY */}
      {stats.blindnessLeft > 0 && (
        <div
          className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle at 50% 58%, rgba(5, 4, 8, 0.28) 9%, rgba(4, 3, 7, 0.94) 36%, rgba(2, 2, 4, 0.99) 70%)',
          }}
        />
      )}

      {/* SLOWNESS DEBUFF FROST BORDER TINT */}
      {stats.slownessLeft > 0 && (
        <div
          className="fixed inset-0 z-10 pointer-events-none border-8 border-[#38bdf8]/45"
          style={{
            boxShadow: 'inset 0 0 60px rgba(56, 189, 248, 0.35)',
          }}
        />
      )}

      {/* TOP BOSS BAR & SCORE HEADER */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-20 w-[min(920px,94vw)] pointer-events-none flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Score & Streak */}
          <div className="pixel-panel px-4 py-2 flex items-center gap-3 pointer-events-auto">
            <Trophy className="w-4 h-4 text-[#ffd166] shrink-0" />
            <span className="font-pixel-body text-xl text-[#fff6e5] tabular-nums">
              SKOR: <strong className="text-[#ffd166]">{stats.score}</strong>
              {stats.streak > 1 ? `  ·  COMBO ×${stats.streak}` : ''}
            </span>
          </div>

          {/* Active Debuffs Status */}
          <div className="flex items-center gap-2">
            {stats.slownessLeft > 0 && (
              <div className="pixel-panel px-3 py-1.5 border-[#38bdf8] flex items-center gap-2 text-[#7dd3fc] font-pixel-body text-lg tabular-nums">
                <Snowflake className="w-4 h-4 shrink-0" />
                <span>SLOWNESS {Math.ceil(stats.slownessLeft)}d</span>
              </div>
            )}
            {stats.blindnessLeft > 0 && (
              <div className="pixel-panel px-3 py-1.5 border-[#a855f7] flex items-center gap-2 text-[#d8b4fe] font-pixel-body text-lg tabular-nums">
                <EyeOff className="w-4 h-4 shrink-0" />
                <span>BLINDNESS {Math.ceil(stats.blindnessLeft)}d</span>
              </div>
            )}
          </div>
        </div>

        {/* Minecraft Dungeons Style Top Boss Health Bar */}
        <div className={`pixel-panel px-4 py-2.5 ${bossMeta.border}`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 font-pixel-title text-xs text-[#ffd166]">
              <Skull className="w-4 h-4 text-[#f87171] shrink-0" />
              <span>{bossMeta.name}</span>
            </div>
            <span className="font-pixel-body text-xl text-[#fff6e5] tabular-nums">
              {bossPct}% HP
            </span>
          </div>
          <div className="w-full h-4 bg-[#0d0a12] border-2 border-[#3d334a] overflow-hidden">
            <div
              className={`h-full ${bossMeta.barColor} transition-transform duration-300 origin-left`}
              style={{ transform: `scaleX(${bossPct / 100})` }}
            />
          </div>
        </div>

        {/* Transient Combat Event Banner */}
        {combatBanner && (
          <div className="mx-auto mt-1 pixel-panel-gold px-5 py-2 font-pixel-body text-xl text-[#ffd166] text-center">
            {combatBanner}
          </div>
        )}
      </div>

      {/* UNIFIED COLLAPSIBLE BOTTOM CONTROL DOCK (No backdrop-blur over WebGL) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-[min(920px,94vw)] flex flex-col items-center pointer-events-none">
        <button
          onClick={() => setDockCollapsed((c) => !c)}
          className="pixel-btn px-3 py-1 text-[10px] text-[#d8cee6] flex items-center gap-1.5 mb-1 pointer-events-auto cursor-pointer whitespace-nowrap"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>TAMPILKAN HUD</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>SEMBUNYIKAN HUD</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="pixel-panel w-full px-4 py-3 flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
            {/* Player Gladiator HP Bar */}
            <div className="flex-1 min-w-[200px] max-w-xs">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-pixel-title text-[11px] text-[#f87171]">
                  <Heart className="w-4 h-4 fill-[#ef4444] text-[#ef4444] shrink-0" />
                  <span>KSATRIA PEDANG HITAM</span>
                </div>
                <span className="font-pixel-body text-xl text-[#fff6e5] tabular-nums">
                  {playerPct}%
                </span>
              </div>
              <div className="w-full h-4 bg-[#0d0a12] border-2 border-[#3d334a] overflow-hidden">
                <div
                  className="h-full bg-[#dc2626] transition-transform duration-300 origin-left"
                  style={{ transform: `scaleX(${playerPct / 100})` }}
                />
              </div>
            </div>

            {/* Movement Helper + Attack Action */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="hidden lg:inline font-pixel-body text-lg text-[#cbd5e1]">
                Gerak: <strong className="text-[#ffd166]">WASD / Panah</strong>
              </span>

              <button
                disabled={!stats.inAttackRange || stats.isAnimatingAction}
                onClick={() => {
                  soundFX.playClick();
                  onTriggerAttack();
                }}
                className={`px-5 py-3 text-xs flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  stats.inAttackRange && !stats.isAnimatingAction
                    ? 'pixel-btn-primary'
                    : 'pixel-btn opacity-55 cursor-not-allowed text-[#94a3b8]'
                }`}
              >
                <Sword className="w-4 h-4 shrink-0" />
                <span>
                  {stats.inAttackRange
                    ? 'SERANG BOS [SPACE]'
                    : 'DEKATI BOS UNTUK MENYERANG'}
                </span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  onOpenQuickGuide();
                }}
                className="pixel-btn px-3.5 py-3 text-xs text-[#fde68a] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                title="Buka Catatan Rumus"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>RUMUS</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  onRetreatToMenu();
                }}
                className="pixel-btn px-3.5 py-3 text-xs text-[#fca5a5] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                title="Keluar Pertarungan"
              >
                <Flag className="w-4 h-4 shrink-0" />
                <span>MENU</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
