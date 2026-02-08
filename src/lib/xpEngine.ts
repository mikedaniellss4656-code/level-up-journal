import { MissionType } from '@/types';

export const XP_TABLE: Record<MissionType, number> = {
  winchester: 300,
  salvatores: 200,
  waynes: 150,
  suits: 100,
};

export const MISSION_LABELS: Record<MissionType, string> = {
  winchester: 'Winchester',
  salvatores: 'Salvatores',
  waynes: 'Waynes',
  suits: 'Suits',
};

export const MISSION_DESCRIPTIONS: Record<MissionType, string> = {
  winchester: 'Missões épicas de alta dificuldade',
  salvatores: 'Desafios importantes e significativos',
  waynes: 'Tarefas moderadas do dia a dia',
  suits: 'Atividades rápidas e simples',
};

export function xpForNextLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.5));
}

export function calculateLevel(totalXP: number): { level: number; currentXP: number; requiredXP: number } {
  let level = 1;
  let accumulatedXP = 0;
  
  while (accumulatedXP + xpForNextLevel(level) <= totalXP) {
    accumulatedXP += xpForNextLevel(level);
    level++;
  }
  
  return {
    level,
    currentXP: totalXP - accumulatedXP,
    requiredXP: xpForNextLevel(level),
  };
}

export function getRankTitle(level: number): string {
  if (level >= 100) return 'Monarca das Sombras';
  if (level >= 80) return 'Caçador Rank-S';
  if (level >= 60) return 'Caçador Rank-A';
  if (level >= 40) return 'Caçador Rank-B';
  if (level >= 25) return 'Caçador Rank-C';
  if (level >= 15) return 'Caçador Rank-D';
  if (level >= 5) return 'Caçador Rank-E';
  return 'Despertar';
}
