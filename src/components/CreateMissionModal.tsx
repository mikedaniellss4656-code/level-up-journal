import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { MissionType } from '@/types';
import { MISSION_LABELS, MISSION_DESCRIPTIONS, XP_TABLE } from '@/lib/xpEngine';
import { format } from 'date-fns';
import { X, Swords, Heart, Building, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateMissionModalProps {
  date: string;
  onClose: () => void;
}

const missionIcons: Record<MissionType, typeof Swords> = {
  winchester: Swords,
  salvatores: Heart,
  waynes: Building,
  suits: Briefcase,
};

const missionStyles: Record<MissionType, string> = {
  winchester: 'border-mission-winchester bg-mission-winchester/10 hover:bg-mission-winchester/20',
  salvatores: 'border-mission-salvatores bg-mission-salvatores/10 hover:bg-mission-salvatores/20',
  waynes: 'border-mission-waynes bg-mission-waynes/10 hover:bg-mission-waynes/20',
  suits: 'border-mission-suits bg-mission-suits/10 hover:bg-mission-suits/20',
};

export function CreateMissionModal({ date, onClose }: CreateMissionModalProps) {
  const { addMission } = useAppStore();
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [selectedType, setSelectedType] = useState<MissionType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completionCriteria, setCompletionCriteria] = useState('');
  const [time, setTime] = useState('');
  const [rewardText, setRewardText] = useState('');
  const [punishmentText, setPunishmentText] = useState('');

  const handleSelectType = (type: MissionType) => {
    setSelectedType(type);
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !title.trim()) return;

    addMission({
      title: title.trim(),
      description: description.trim(),
      type: selectedType,
      completionCriteria: completionCriteria.trim(),
      rewardText: rewardText.trim(),
      punishmentText: punishmentText.trim(),
      date,
      time: time || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="status-window w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-orbitron text-lg text-primary text-glow">Nova Missão</h2>
            <p className="text-sm text-muted-foreground">
              {format(new Date(date), "dd 'de' MMMM")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'type' && (
          <div className="p-4 space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Selecione o tipo de missão:</p>
            
            {(Object.keys(MISSION_LABELS) as MissionType[]).map((type) => {
              const Icon = missionIcons[type];
              return (
                <button
                  key={type}
                  onClick={() => handleSelectType(type)}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 text-left transition-all',
                    missionStyles[type]
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{MISSION_LABELS[type]}</span>
                        <span className="text-sm font-orbitron">+{XP_TABLE[type]} XP</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{MISSION_DESCRIPTIONS[type]}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 'details' && selectedType && (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => setStep('type')}
                className="hover:text-primary transition-colors"
              >
                ← Voltar
              </button>
              <span>|</span>
              <span>{MISSION_LABELS[selectedType]}</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nome da missão"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Detalhes da missão"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Critério de Conclusão</label>
              <input
                type="text"
                value={completionCriteria}
                onChange={(e) => setCompletionCriteria(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="O que define a missão como completa?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Horário</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-success">Recompensa</label>
                <input
                  type="text"
                  value={rewardText}
                  onChange={(e) => setRewardText(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  placeholder="Ao completar..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-destructive">Punição</label>
                <input
                  type="text"
                  value={punishmentText}
                  onChange={(e) => setPunishmentText(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive"
                  placeholder="Ao falhar..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors glow-primary"
            >
              Criar Missão
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
