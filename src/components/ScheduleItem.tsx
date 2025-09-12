import { ScheduledActivity, MoodType } from "@/store/weekendStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Smile, Zap, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleItemProps {
  activity: ScheduledActivity;
  onRemove: () => void;
  onMoodChange: (mood: MoodType) => void;
}

const moodIcons: Record<
  MoodType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  happy: {
    icon: <Smile className="h-4 w-4" />,
    color: "text-mood-happy",
    label: "Happy",
  },
  relaxed: {
    icon: <Heart className="h-4 w-4" />,
    color: "text-mood-relaxed",
    label: "Relaxed",
  },
  energetic: {
    icon: <Zap className="h-4 w-4" />,
    color: "text-mood-energetic",
    label: "Energetic",
  },
};

export const ScheduleItem = ({
  activity,
  onRemove,
  onMoodChange,
}: ScheduleItemProps) => {
  return (
    <Card
      className={cn(
        "group relative p-4 transition-all duration-200",
        activity.category === "food" && "border-l-4 border-l-food bg-food/5",
        activity.category === "outdoor" &&
          "border-l-4 border-l-outdoor bg-outdoor/5",
        activity.category === "entertainment" &&
          "border-l-4 border-l-entertainment bg-entertainment/5",
        activity.category === "relax" && "border-l-4 border-l-relax bg-relax/5"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{activity.icon}</span>
            <h4 className="font-medium text-card-foreground">
              {activity.name}
            </h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {activity.description}
          </p>

          <div className="flex gap-1">
            {Object.entries(moodIcons).map(([mood, { icon, color, label }]) => (
              <Button
                key={mood}
                size="sm"
                variant="ghost"
                onClick={() => onMoodChange(mood as MoodType)}
                className={cn(
                  "h-8 w-8 p-0 hover:scale-110 transition-transform",
                  activity.mood === mood
                    ? color
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={label}
              >
                {icon}
              </Button>
            ))}
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemove()}
          className="opacity-100 h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
