import { useState } from 'react';
import { format, startOfYear, endOfYear, eachDayOfInterval, startOfWeek, getMonth, isToday, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface YearCalendarProps {
  year: number;
  onSelectDate: (date: string) => void;
  selectedDate?: string;
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export function YearCalendar({ year, onSelectDate, selectedDate }: YearCalendarProps) {
  const { days } = useAppStore();
  
  const getDayStatus = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    const dayData = days[key];
    
    if (!dayData) return null;
    if (dayData.blocked) return 'blocked';
    
    const missions = dayData.missions;
    if (missions.length === 0) return null;
    
    const allCompleted = missions.every(m => m.status === 'completed');
    const anyFailed = missions.some(m => m.status === 'failed');
    const anyPending = missions.some(m => m.status === 'pending');
    
    if (anyFailed) return 'failed';
    if (allCompleted) return 'completed';
    if (anyPending) return 'has-missions';
    
    return null;
  };

  const renderMonth = (monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
    const startPadding = firstDay.getDay();
    
    return (
      <div key={monthIndex} className="status-window p-3">
        <h3 className="font-orbitron text-sm text-primary mb-2 text-center">
          {MONTHS[monthIndex]}
        </h3>
        
        <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
          {WEEKDAYS.map((day, i) => (
            <div key={i} className="text-[10px] text-muted-foreground font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: startPadding }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}
          
          {daysInMonth.map((date) => {
            const dateKey = format(date, 'yyyy-MM-dd');
            const status = getDayStatus(date);
            const isSelected = dateKey === selectedDate;
            const isTodayDate = isToday(date);
            
            return (
              <button
                key={dateKey}
                onClick={() => onSelectDate(dateKey)}
                disabled={status === 'blocked'}
                className={cn(
                  'calendar-day text-[11px]',
                  status === 'has-missions' && 'bg-primary/20 text-primary',
                  status === 'completed' && 'bg-success/20 text-success',
                  status === 'failed' && 'bg-destructive/20 text-destructive',
                  status === 'blocked' && 'bg-destructive/30 opacity-50 cursor-not-allowed',
                  isTodayDate && 'ring-1 ring-primary',
                  isSelected && 'bg-primary text-primary-foreground'
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: 12 }).map((_, i) => renderMonth(i))}
    </div>
  );
}
