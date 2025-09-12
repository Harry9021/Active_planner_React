import { useWeekendStore, WeekendLength } from '@/store/weekendStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

const weekendOptions: {
  value: WeekendLength;
  label: string;
  description: string;
  days: string[];
  icon: string;
}[] = [
  {
    value: 'short',
    label: 'Weekend',
    description: '2-day classic weekend',
    days: ['Saturday', 'Sunday'],
    icon: '🏠',
  },
  {
    value: 'long',
    label: 'Long Weekend',
    description: '3-day extended break',
    days: ['Friday', 'Saturday', 'Sunday'],
    icon: '🌟',
  },
  {
    value: 'extended',
    label: 'Holiday Week',
    description: '4-day vacation',
    days: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
    icon: '🎉',
  },
];

export const WeekendLengthSelector = () => {
  const { weekendLength, setWeekendLength } = useWeekendStore();

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="h-4 w-4" />
        <h3 className="font-medium">Weekend Length</h3>
      </div>
      
      <div className="space-y-2">
        {weekendOptions.map((option) => (
          <Button
            key={option.value}
            variant={weekendLength === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setWeekendLength(option.value)}
            className={cn(
              'w-full justify-start h-auto p-3 text-left transition-all hover:scale-105',
              weekendLength === option.value && 'animate-pulse-glow'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{option.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {option.description}
                </div>
                <div className="flex gap-1 mt-1">
                  {option.days.map((day) => (
                    <span 
                      key={day} 
                      className="text-xs px-1.5 py-0.5 bg-primary/10 rounded-sm"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};