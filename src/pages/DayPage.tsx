import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, subDays, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppStore } from '@/store/useAppStore';
import { PlayerStatus } from '@/components/PlayerStatus';
import { MissionCard } from '@/components/MissionCard';
import { CreateMissionModal } from '@/components/CreateMissionModal';
import { ChevronLeft, ChevronRight, Plus, AlertTriangle } from 'lucide-react';

export default function DayPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const currentDate = date || format(new Date(), 'yyyy-MM-dd');
  const { getDayData, updateMissionStatus, deleteMission } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const dayData = getDayData(currentDate);
  const dateObj = new Date(currentDate + 'T12:00:00');
  const isTodayDate = isToday(dateObj);

  const handlePrevDay = () => {
    const prev = format(subDays(dateObj, 1), 'yyyy-MM-dd');
    navigate(`/day/${prev}`);
  };

  const handleNextDay = () => {
    const next = format(addDays(dateObj, 1), 'yyyy-MM-dd');
    navigate(`/day/${next}`);
  };

  const pendingMissions = dayData.missions.filter(m => m.status === 'pending');
  const completedMissions = dayData.missions.filter(m => m.status === 'completed');
  const failedMissions = dayData.missions.filter(m => m.status === 'failed');

  return (
    <div className="min-h-screen pb-20 p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <PlayerStatus />

        <div className="status-window p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevDay}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {isTodayDate ? 'Hoje' : format(dateObj, 'EEEE', { locale: ptBR })}
              </p>
              <h1 className="font-orbitron text-xl text-primary text-glow">
                {format(dateObj, "dd 'de' MMMM", { locale: ptBR })}
              </h1>
            </div>
            
            <button
              onClick={handleNextDay}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {dayData.blocked && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/20 border border-destructive/50 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span className="text-sm text-destructive">
                Dia bloqueado devido a falhas consecutivas
              </span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {dayData.missions.length} missões
            </span>
            <span className="font-orbitron text-primary">
              +{dayData.xpEarned} XP ganhos
            </span>
          </div>
        </div>

        {!dayData.blocked && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full py-3 bg-secondary border border-primary/30 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all"
          >
            <Plus className="w-5 h-5 text-primary" />
            <span className="font-medium text-primary">Nova Missão</span>
          </button>
        )}

        {pendingMissions.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-orbitron text-sm text-warning flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              Pendentes ({pendingMissions.length})
            </h2>
            {pendingMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onComplete={() => updateMissionStatus(currentDate, mission.id, 'completed')}
                onFail={() => updateMissionStatus(currentDate, mission.id, 'failed')}
                onDelete={() => deleteMission(currentDate, mission.id)}
              />
            ))}
          </div>
        )}

        {completedMissions.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-orbitron text-sm text-success flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              Completadas ({completedMissions.length})
            </h2>
            {completedMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        )}

        {failedMissions.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-orbitron text-sm text-destructive flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              Falhas ({failedMissions.length})
            </h2>
            {failedMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        )}

        {dayData.missions.length === 0 && !dayData.blocked && (
          <div className="status-window p-8 text-center">
            <p className="text-muted-foreground mb-2">Nenhuma missão para este dia</p>
            <p className="text-sm text-muted-foreground/60">
              Clique em "Nova Missão" para começar
            </p>
          </div>
        )}

        {showCreateModal && (
          <CreateMissionModal
            date={currentDate}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </div>
    </div>
  );
}
