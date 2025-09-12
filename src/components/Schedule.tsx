import { useWeekendStore, DayKey } from "@/store/weekendStore";
import { ScheduleItem } from "./ScheduleItem";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { WeekendLengthSelector } from "./WeekendLengthSelector";
import { TabsContent } from "@radix-ui/react-tabs";

interface ScheduleProps {
  selectedDay: DayKey;
  onDaySelect: (day: DayKey) => void;
}

const dayLabels: Record<DayKey, string> = {
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const dayEmojis: Record<DayKey, string> = {
  thursday: "🌅",
  friday: "🎉",
  saturday: "🌟",
  sunday: "☀️",
};

export const Schedule = ({ selectedDay, onDaySelect }: ScheduleProps) => {
  const {
    schedule,
    removeActivity,
    updateMood,
    reorderActivities,
    clearSchedule,
    availableDays,
  } = useWeekendStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activities = schedule[selectedDay];
      const oldIndex = activities.findIndex(
        (item) => item.scheduledId === active.id
      );
      const newIndex = activities.findIndex(
        (item) => item.scheduledId === over.id
      );

      reorderActivities(selectedDay, arrayMove(activities, oldIndex, newIndex));
    }
  };

  const currentSchedule = schedule[selectedDay];

  return (
    <div className="space-y-6 w-full">
      {/* Day Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
        {availableDays.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? "default" : "outline"}
            onClick={() => onDaySelect(day)}
            className={cn(
              "transition-all hover:scale-105 animate-fade-in text-sm p-2",
              selectedDay === day && "animate-pulse-glow"
            )}
          >
            {/* <span className="mr-2">{dayEmojis[day]}</span> */}
            <span className="hidden sm:inline">{dayLabels[day].slice(0, 3)}</span>
            <span className="sm:hidden">{dayLabels[day].slice(0, 3)}</span>
          </Button>
        ))}
      </div>

      {/* Schedule Content */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 animate-slide-in">
            <span>{dayEmojis[selectedDay]}</span>
            {dayLabels[selectedDay]} Schedule
            <span className="text-sm font-normal text-muted-foreground">
              ({currentSchedule.length} activities)
            </span>
          </h2>

          {currentSchedule.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={clearSchedule}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
            </Button>
          )}
        </div>

        {currentSchedule.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No activities planned yet
            </h3>
            <p className="text-muted-foreground">
              Add some activities from the list to start planning your{" "}
              {selectedDay}!
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentSchedule.map((item) => item.scheduledId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {currentSchedule.map((activity) => (
                  <ScheduleItem
                    key={activity.scheduledId}
                    activity={activity}
                    onRemove={() => {
                      console.log("Removing activity:", activity.scheduledId);
                      removeActivity(selectedDay, activity.scheduledId);
                    }}
                    onMoodChange={(mood) =>
                      updateMood(selectedDay, activity.scheduledId, mood)
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Card>
      <TabsContent value="activities" className="space-y-6">
        <div className="flex gap-2 sm:w-auto">
          <WeekendLengthSelector />
        </div>
      </TabsContent>
    </div>
  );
};
