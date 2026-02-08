import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { SeverityMode, DefaultView } from '@/types';
import { PlayerStatus } from '@/components/PlayerStatus';
import { AlertTriangle, RotateCcw, Shield, Eye } from 'lucide-react';

export default function SettingsPage() {
  const { severity, setSeverity, defaultView, setDefaultView, resetYear } = useAppStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const severityOptions: { value: SeverityMode; label: string; description: string }[] = [
    { 
      value: 'tolerante', 
      label: 'Tolerante', 
      description: 'Sem penalidades por falhas consecutivas' 
    },
    { 
      value: 'normal', 
      label: 'Normal', 
      description: '25% de penalidade após 4 falhas' 
    },
    { 
      value: 'punitivo', 
      label: 'Punitivo', 
      description: '40% de penalidade após 4 falhas' 
    },
  ];

  const viewOptions: { value: DefaultView; label: string }[] = [
    { value: 'year', label: 'Visão do Ano' },
    { value: 'day', label: 'Visão do Dia' },
  ];

  const handleReset = () => {
    resetYear();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen pb-20 p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <PlayerStatus />

        <div className="status-window p-4">
          <h1 className="font-orbitron text-xl text-primary text-glow mb-6">
            Ajustes
          </h1>

          <div className="space-y-6">
            {/* Severity Mode */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-primary" />
                <h2 className="font-medium">Modo de Severidade</h2>
              </div>
              
              <div className="space-y-2">
                {severityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSeverity(option.value)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      severity === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      {severity === option.value && (
                        <span className="text-xs text-primary font-orbitron">ATIVO</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Default View */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-primary" />
                <h2 className="font-medium">Visão Padrão</h2>
              </div>
              
              <div className="flex gap-2">
                {viewOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDefaultView(option.value)}
                    className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-all ${
                      defaultView === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Year */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <RotateCcw className="w-4 h-4 text-destructive" />
                <h2 className="font-medium text-destructive">Zona de Perigo</h2>
              </div>
              
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full py-3 border border-destructive/50 text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  Resetar Ano
                </button>
              ) : (
                <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      Isso irá apagar todo o seu progresso, incluindo XP, nível e todas as missões.
                      Esta ação não pode ser desfeita.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                    >
                      Confirmar Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
