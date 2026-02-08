import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { PlayerStatus } from '@/components/PlayerStatus';
import { XP_TABLE, MISSION_LABELS, getRankTitle } from '@/lib/xpEngine';
import { MissionType } from '@/types';
import { Trophy, Target, Flame, TrendingUp, Award } from 'lucide-react';

export default function AnalysisPage() {
  const { days, xp, level, consecutiveFailures, severity } = useAppStore();

  const stats = useMemo(() => {
    const allMissions = Object.values(days).flatMap(d => d.missions);
    
    const completed = allMissions.filter(m => m.status === 'completed').length;
    const failed = allMissions.filter(m => m.status === 'failed').length;
    const pending = allMissions.filter(m => m.status === 'pending').length;
    const total = allMissions.length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const byType: Record<MissionType, { completed: number; failed: number; total: number }> = {
      winchester: { completed: 0, failed: 0, total: 0 },
      salvatores: { completed: 0, failed: 0, total: 0 },
      waynes: { completed: 0, failed: 0, total: 0 },
      suits: { completed: 0, failed: 0, total: 0 },
    };

    allMissions.forEach(m => {
      byType[m.type].total++;
      if (m.status === 'completed') byType[m.type].completed++;
      if (m.status === 'failed') byType[m.type].failed++;
    });

    const activeDays = Object.values(days).filter(d => d.missions.length > 0).length;
    const totalXPEarned = Object.values(days).reduce((sum, d) => sum + d.xpEarned, 0);

    return {
      completed,
      failed,
      pending,
      total,
      completionRate,
      byType,
      activeDays,
      totalXPEarned,
    };
  }, [days]);

  return (
    <div className="min-h-screen pb-20 p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <PlayerStatus />

        <div className="status-window p-4">
          <h1 className="font-orbitron text-xl text-primary text-glow mb-4">
            Análise de Progresso
          </h1>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <Trophy className="w-6 h-6 text-success mx-auto mb-1" />
              <p className="font-orbitron text-2xl text-success">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completadas</p>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <Target className="w-6 h-6 text-destructive mx-auto mb-1" />
              <p className="font-orbitron text-2xl text-destructive">{stats.failed}</p>
              <p className="text-xs text-muted-foreground">Falhas</p>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <TrendingUp className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="font-orbitron text-2xl text-primary">{stats.completionRate}%</p>
              <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <Flame className="w-6 h-6 text-warning mx-auto mb-1" />
              <p className="font-orbitron text-2xl text-warning">{stats.activeDays}</p>
              <p className="text-xs text-muted-foreground">Dias Ativos</p>
            </div>
          </div>
        </div>

        <div className="status-window p-4">
          <h2 className="font-orbitron text-sm text-primary mb-4">Por Tipo de Missão</h2>
          
          <div className="space-y-3">
            {(Object.keys(stats.byType) as MissionType[]).map(type => {
              const data = stats.byType[type];
              const rate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
              
              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{MISSION_LABELS[type]}</span>
                    <span className="text-muted-foreground">
                      {data.completed}/{data.total} ({rate}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="status-window p-4">
          <h2 className="font-orbitron text-sm text-primary mb-4">Status do Sistema</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rank Atual</span>
              <span className="text-primary font-orbitron">{getRankTitle(level)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">XP Total</span>
              <span className="font-orbitron">{xp.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Modo</span>
              <span className="capitalize">{severity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Falhas Consecutivas</span>
              <span className={consecutiveFailures >= 4 ? 'text-destructive' : ''}>
                {consecutiveFailures}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
