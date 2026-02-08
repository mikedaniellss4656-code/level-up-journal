import { useAppStore } from '@/store/useAppStore';
import { calculateLevel, getRankTitle } from '@/lib/xpEngine';

export function PlayerStatus() {
  const { xp, level } = useAppStore();
  const { currentXP, requiredXP } = calculateLevel(xp);
  const rankTitle = getRankTitle(level);
  const progressPercent = (currentXP / requiredXP) * 100;

  return (
    <div className="status-window p-4 animate-fade-in">
      <div className="scan-line" />
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm text-muted-foreground uppercase tracking-wider">Caçador</h2>
          <p className="text-lg font-orbitron text-primary text-glow">{rankTitle}</p>
        </div>
        <div className="level-badge">
          LV. {level}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">EXP</span>
          <span className="font-orbitron text-primary">
            {currentXP.toLocaleString()} / {requiredXP.toLocaleString()}
          </span>
        </div>
        <div className="xp-bar">
          <div 
            className="xp-bar-fill" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
        <div className="text-right text-xs text-muted-foreground">
          Total: {xp.toLocaleString()} XP
        </div>
      </div>
    </div>
  );
}
