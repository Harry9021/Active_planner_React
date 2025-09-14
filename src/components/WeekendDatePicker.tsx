import * as React from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isWeekend,
  getDay,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useWeekendStore, WeekendLength, DayKey } from "@/store/weekendStore";

export function WeekendDatePicker() {
  const [date, setDate] = React.useState<Date>();
  const { setSelectedWeekendDates, selectedWeekendDates, weekendLength } =
    useWeekendStore();

  const getWeekendDaysForLength = (length: WeekendLength): number[] => {
    switch (length) {
      case "short":
        return [6, 0]; // Saturday, Sunday
      case "long":
        return [5, 6, 0]; // Friday, Saturday, Sunday
      case "extended":
        return [4, 5, 6, 0]; // Thursday, Friday, Saturday, Sunday
      default:
        return [6, 0];
    }
  };

  const getWeekendDayNames = (length: WeekendLength): string => {
    switch (length) {
      case "short":
        return "Sat-Sun";
      case "long":
        return "Fri-Sun";
      case "extended":
        return "Thu-Sun";
      default:
        return "Sat-Sun";
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekendDays = getWeekendDaysForLength(weekendLength);
    const weekendDates: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(weekStart, i);
      const dayOfWeek = getDay(currentDate);
      if (weekendDays.includes(dayOfWeek)) {
        weekendDates.push(currentDate);
      }
    }

    setDate(selectedDate);
    setSelectedWeekendDates(weekendDates);
  };

  const formatSelectedDates = () => {
    if (!selectedWeekendDates || selectedWeekendDates.length === 0) {
      return `Select ${getWeekendDayNames(weekendLength)} dates`;
    }

    const sortedDates = selectedWeekendDates
      .map((date) => (date instanceof Date ? date : new Date(date)))
      .sort((a, b) => a.getTime() - b.getTime());
    if (sortedDates.length >= 2) {
      return `${format(sortedDates[0], "MMM dd")} - ${format(
        sortedDates[sortedDates.length - 1],
        "MMM dd"
      )}`;
    }

    return sortedDates.map((date) => format(date, "MMM dd")).join(", ");
  };

  const isWeekendDay = (date: Date): boolean => {
    const dayOfWeek = getDay(date);
    const weekendDays = getWeekendDaysForLength(weekendLength);
    return weekendDays.includes(dayOfWeek);
  };

  return (
    <div className="flex space-y-2 justify-center items-center gap-2">
      {/* <label className="text-center text-sm font-medium whitespace-nowrap hidden md:inline-block">
        Weekend Dates :{" "}
      </label> */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-center font-normal",
              "w-10 md:w-full md:min-w-[200px]", 
              "p-2 md:p-3", 
              !selectedWeekendDates?.length && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline-block">{formatSelectedDates()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            className="p-3 pointer-events-auto"
            modifiers={{
              weekend: isWeekendDay,
              selected: (date) =>
                selectedWeekendDates?.some((d) => isSameDay(d, date)) || false,
            }}
            modifiersStyles={{
              weekend: {
                backgroundColor: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
                fontWeight: "bold",
              },
              selected: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              },
            }}
          />
          <div className="p-3 border-t text-xs text-muted-foreground">
            <div className="font-medium mb-1">
              Current: {getWeekendDayNames(weekendLength)} weekend
            </div>
            <span className="hidden md:inline-block">Select any date to plan that week's </span>
            <span className="md:hidden">Pick </span>
            {getWeekendDayNames(weekendLength).toLowerCase()} days
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
