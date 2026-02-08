export type MissionType = 'winchester' | 'salvatores' | 'waynes' | 'suits';

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  completionCriteria: string;
  rewardText: string;
  punishmentText: string;
  date: string; // yyyy-MM-dd
  time?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface DayData {
  date: string;
  missions: Mission[];
  xpEarned: number;
  blocked: boolean;
}

export type SeverityMode = 'normal' | 'punitivo' | 'tolerante';
export type DefaultView = 'year' | 'day';
