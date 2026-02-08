import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { YearCalendar } from '@/components/YearCalendar';
import { PlayerStatus } from '@/components/PlayerStatus';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function YearPage() {
  const navigate = useNavigate();
  const [year, setYear] = useState(new Date().getFullYear());

  const handleSelectDate = (date: string) => {
    navigate(`/day/${date}`);
  };

  return (
    <div className="min-h-screen pb-20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <PlayerStatus />

        <div className="status-window p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setYear(y => y - 1)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h1 className="font-orbitron text-2xl text-primary text-glow">
              {year}
            </h1>
            
            <button
              onClick={() => setYear(y => y + 1)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center text-xs mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-primary/20" />
              <span className="text-muted-foreground">Pendente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-success/20" />
              <span className="text-muted-foreground">Completo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-destructive/20" />
              <span className="text-muted-foreground">Falha</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-destructive/30 opacity-50" />
              <span className="text-muted-foreground">Bloqueado</span>
            </div>
          </div>
        </div>

        <YearCalendar 
          year={year} 
          onSelectDate={handleSelectDate}
        />
      </div>
    </div>
  );
}
