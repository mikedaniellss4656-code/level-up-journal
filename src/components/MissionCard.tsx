import { Mission } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { XP_TABLE, MISSION_LABELS } from '@/lib/xpEngine';
import { CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MissionCardProps {
  mission: Mission;
  onComplete?: () => void;
  onFail?: () => void;
  onDelete?: () => void;
}

const missionColors: Record<string, string> = {
  winchester: 'border-l-mission-winchester',
  salvatores: 'border-l-mission-salvatores',
  waynes: 'border-l-mission-waynes',
  suits: 'border-l-mission-suits',
};

const statusIcons = {
  pending: Clock,
  completed: CheckCircle,
  failed: XCircle,
};

export function MissionCard({ mission, onComplete, onFail, onDelete }: MissionCardProps) {
  const StatusIcon = statusIcons[mission.status];
  const xpValue = XP_TABLE[mission.type];

  return (
    <div
      className={cn(
        'mission-card border-l-4 animate-slide-in',
        missionColors[mission.type],
        mission.status === 'completed' && 'bg-success/5 border-success/50',
        mission.status === 'failed' && 'bg-destructive/5 border-destructive/50'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {MISSION_LABELS[mission.type]}
            </span>
            <span className="text-xs font-orbitron text-primary">+{xpValue} XP</span>
          </div>
          
          <h3 className={cn(
            'font-semibold text-lg mb-1',
            mission.status === 'completed' && 'text-success',
            mission.status === 'failed' && 'text-destructive line-through'
          )}>
            {mission.title}
          </h3>
          
          {mission.description && (
            <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
          )}

          {mission.time && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {mission.time}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <StatusIcon 
            className={cn(
              'w-6 h-6',
              mission.status === 'pending' && 'text-warning',
              mission.status === 'completed' && 'text-success',
              mission.status === 'failed' && 'text-destructive'
            )} 
          />
          
          {mission.status === 'pending' && (
            <div className="flex gap-1">
              <button
                onClick={onComplete}
                className="p-1.5 rounded bg-success/20 text-success hover:bg-success/30 transition-colors"
                title="Completar"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={onFail}
                className="p-1.5 rounded bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                title="Falhar"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {onDelete && mission.status === 'pending' && (
            <button
              onClick={onDelete}
              className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {mission.completionCriteria && mission.status === 'pending' && (
        <div className="mt-3 pt-3 border-t border-border/50 text-sm">
          <span className="text-muted-foreground">Critério: </span>
          <span>{mission.completionCriteria}</span>
        </div>
      )}
    </div>
  );
}
