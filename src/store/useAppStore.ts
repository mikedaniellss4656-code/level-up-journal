import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mission, DayData, SeverityMode, DefaultView } from '@/types';
import { XP_TABLE, xpForNextLevel } from '@/lib/xpEngine';
import { format, addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  xp: number;
  level: number;
  days: Record<string, DayData>;
  consecutiveFailures: number;
  severity: SeverityMode;
  defaultView: DefaultView;
  
  // Actions
  addMission: (mission: Omit<Mission, 'id' | 'status'>) => void;
  updateMissionStatus: (date: string, missionId: string, status: 'completed' | 'failed') => void;
  deleteMission: (date: string, missionId: string) => void;
  setSeverity: (severity: SeverityMode) => void;
  setDefaultView: (view: DefaultView) => void;
  resetYear: () => void;
  getDayData: (date: string) => DayData;
}

const getInitialDayData = (date: string): DayData => ({
  date,
  missions: [],
  xpEarned: 0,
  blocked: false,
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      days: {},
      consecutiveFailures: 0,
      severity: 'normal',
      defaultView: 'year',

      getDayData: (date: string) => {
        const state = get();
        return state.days[date] || getInitialDayData(date);
      },

      addMission: (missionData) => {
        const mission: Mission = {
          ...missionData,
          id: uuidv4(),
          status: 'pending',
        };

        set((state) => {
          const dayKey = mission.date;
          const day = state.days[dayKey] || getInitialDayData(dayKey);
          
          return {
            days: {
              ...state.days,
              [dayKey]: {
                ...day,
                missions: [...day.missions, mission],
              },
            },
          };
        });
      },

      deleteMission: (date: string, missionId: string) => {
        set((state) => {
          const day = state.days[date];
          if (!day) return state;

          return {
            days: {
              ...state.days,
              [date]: {
                ...day,
                missions: day.missions.filter((m) => m.id !== missionId),
              },
            },
          };
        });
      },

      updateMissionStatus: (date: string, missionId: string, status: 'completed' | 'failed') => {
        set((state) => {
          const day = state.days[date];
          if (!day) return state;

          const mission = day.missions.find((m) => m.id === missionId);
          if (!mission || mission.status !== 'pending') return state;

          const updatedMissions = day.missions.map((m) =>
            m.id === missionId ? { ...m, status } : m
          );

          let xpDelta = 0;
          let newFailures = state.consecutiveFailures;

          if (status === 'completed') {
            xpDelta = XP_TABLE[mission.type];
            newFailures = 0;
          } else {
            newFailures += 1;
          }

          let adjustedXP = xpDelta;
          if (newFailures >= 4 && state.severity !== 'tolerante') {
            const penalty = state.severity === 'punitivo' ? 0.6 : 0.75;
            adjustedXP = Math.round(xpDelta * penalty);
          }

          const newDay: DayData = {
            ...day,
            missions: updatedMissions,
            xpEarned: day.xpEarned + adjustedXP,
          };

          const updatedDays = { ...state.days, [date]: newDay };

          // Block future days on severe failure streak
          if (newFailures >= 4 && state.severity !== 'tolerante') {
            let next = addDays(new Date(date), 1);
            const currentYear = new Date().getFullYear();
            
            while (next.getFullYear() === currentYear) {
              const key = format(next, 'yyyy-MM-dd');
              if (!updatedDays[key]) {
                updatedDays[key] = getInitialDayData(key);
              }
              updatedDays[key] = { ...updatedDays[key], blocked: true };
              next = addDays(next, 1);
            }
          }

          // Recalculate level
          let totalXP = state.xp + adjustedXP;
          let newLevel = 1;
          let acc = 0;
          while (acc + xpForNextLevel(newLevel) <= totalXP) {
            acc += xpForNextLevel(newLevel);
            newLevel++;
          }

          return {
            days: updatedDays,
            consecutiveFailures: newFailures,
            xp: totalXP,
            level: newLevel,
          };
        });
      },

      setSeverity: (severity) => set({ severity }),
      setDefaultView: (view) => set({ defaultView: view }),
      
      resetYear: () => set({ 
        xp: 0, 
        level: 1, 
        days: {}, 
        consecutiveFailures: 0 
      }),
    }),
    {
      name: 'solo-leveling-storage',
    }
  )
);
