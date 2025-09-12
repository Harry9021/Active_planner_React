import { useWeekendStore } from '@/store/weekendStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Gift, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isWithinInterval, addDays } from 'date-fns';

export const HolidayAwareness = () => {
  const { getUpcomingHolidays, setWeekendLength, weekendLength } = useWeekendStore();
  const holidays = getUpcomingHolidays();
  
  const upcomingHolidays = holidays.filter(holiday => {
    const now = new Date();
    const twoWeeksFromNow = addDays(now, 14);
    return isWithinInterval(holiday.date, { start: now, end: twoWeeksFromNow });
  });

  if (upcomingHolidays.length === 0) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Gift className="h-4 w-4 text-accent animate-bounce-soft" />
        <h3 className="font-medium text-accent-foreground">Upcoming Holidays</h3>
        <Sparkles className="h-4 w-4 text-accent" />
      </div>
      
      <div className="space-y-3">
        {upcomingHolidays.map((holiday) => (
          <div key={holiday.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{holiday.name}</div>
                <div className="text-xs text-muted-foreground">
                  {format(holiday.date, 'EEEE, MMMM do')}
                </div>
              </div>
              
              {holiday.weekend && holiday.weekend !== weekendLength && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setWeekendLength(holiday.weekend!)}
                  className={cn(
                    'text-xs px-2 py-1 h-auto border-accent/30 hover:bg-accent/10',
                    'animate-pulse-glow'
                  )}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Plan {holiday.weekend === 'long' ? '3' : '4'}-day
                </Button>
              )}
            </div>
            
            {holiday.weekend && (
              <div className="text-xs text-accent/80 bg-accent/10 px-2 py-1 rounded-sm">
                💡 Perfect for a {holiday.weekend} weekend adventure!
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};