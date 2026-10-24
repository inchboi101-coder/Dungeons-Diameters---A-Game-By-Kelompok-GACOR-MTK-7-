export enum GameScreen {
  MAIN_MENU = 'MAIN_MENU',
  HOW_TO_PLAY = 'HOW_TO_PLAY',
  GUIDEBOOK = 'GUIDEBOOK',
  DIFFICULTY_SELECT = 'DIFFICULTY_SELECT',
  BATTLE = 'BATTLE',
  VICTORY = 'VICTORY',
  DEFEAT = 'DEFEAT',
  QUIT = 'QUIT',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export type CircleTopic =
  | 'Unsur Lingkaran'
  | 'Sudut Pusat & Keliling'
  | 'Segi Empat Tali Busur'
  | 'Panjang Busur'
  | 'Luas Juring'
  | 'Garis Singgung Lingkaran';

export interface MathQuestion {
  id: string;
  difficulty: Difficulty;
  topic: CircleTopic;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  diagramType?: 'unsur' | 'sudut' | 'segiempat' | 'busur_juring' | 'singgung';
  diagramLabel?: string;
}

export interface GuideChapter {
  id: string;
  number: string;
  title: CircleTopic;
  subtitle: string;
  summary: string;
  formulas: { label: string; formula: string; note?: string }[];
  keyPoints: string[];
  example: {
    problem: string;
    solution: string;
  };
  diagramType: 'unsur' | 'sudut' | 'segiempat' | 'busur' | 'juring' | 'singgung';
}

export interface BattleStats {
  playerHp: number;
  maxPlayerHp: number;
  bossHp: number;
  maxBossHp: number;
  score: number;
  streak: number;
  correctCount: number;
  wrongCount: number;
  slownessLeft: number; // seconds
  blindnessLeft: number; // seconds
  inAttackRange: boolean;
  isAnimatingAction: boolean;
}
