import { Link, useLocation } from 'react-router-dom';
import { Calendar, CalendarDays, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Calendar, label: 'Ano' },
  { path: '/today', icon: CalendarDays, label: 'Hoje' },
  { path: '/analysis', icon: BarChart3, label: 'Análise' },
  { path: '/settings', icon: Settings, label: 'Ajustes' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/today' && location.pathname.startsWith('/day/'));
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'nav-item flex flex-col items-center gap-1 py-3',
                isActive && 'active'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
