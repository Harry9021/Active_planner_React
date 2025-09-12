import { Activity, ActivityCategory } from "@/store/weekendStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  activity: Activity;
  onAdd: () => void;
  onRemove?: () => void;
}

const categoryStyles: Record<ActivityCategory, string> = {
  food: "gradient-food border-food/20 hover:shadow-food/20",
  outdoor: "gradient-outdoor border-outdoor/20 hover:shadow-outdoor/20",
  entertainment:
    "gradient-entertainment border-entertainment/20 hover:shadow-entertainment/20",
  relax: "gradient-relax border-relax/20 hover:shadow-relax/20",
  learning:
    "gradient-entertainment border-entertainment/20 hover:shadow-entertainment/20",
  social: "gradient-outdoor border-outdoor/20 hover:shadow-outdoor/20",
  adventure: "gradient-outdoor border-outdoor/20 hover:shadow-outdoor/20",
};

export const ActivityCard = ({
  activity,
  onAdd,
  onRemove,
}: ActivityCardProps) => {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer",
        categoryStyles[activity.category]
      )}
      onClick={onAdd}
    >
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 text-card-foreground/70 hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      <div className="p-4 text-center">
        <div className="text-3xl mb-2">{activity.icon}</div>
        <h3 className="font-semibold text-card-foreground mb-1">
          {activity.name}
        </h3>
        <p className="text-sm text-card-foreground/70 mb-3">
          {activity.description}
        </p>

        <Button
          size="sm"
          variant="secondary"
          className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 border-white/30"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Category indicator
      <div className="absolute top-2 right-2">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            activity.category === "food" && "bg-food",
            activity.category === "outdoor" && "bg-outdoor",
            activity.category === "entertainment" && "bg-entertainment",
            activity.category === "relax" && "bg-relax"
          )}
        />
      </div> */}
    </Card>
  );
};
