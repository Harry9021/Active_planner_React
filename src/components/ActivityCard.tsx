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
  food: "gradient-food border-food/30 hover:shadow-food/30 hover:border-food/50",
  outdoor:
    "gradient-outdoor border-outdoor/30 hover:shadow-outdoor/30 hover:border-outdoor/50",
  entertainment:
    "gradient-entertainment border-entertainment/30 hover:shadow-entertainment/30 hover:border-entertainment/50",
  relax:
    "gradient-relax border-relax/30 hover:shadow-relax/30 hover:border-relax/50",
  learning:
    "gradient-entertainment border-entertainment/30 hover:shadow-entertainment/30 hover:border-entertainment/50",
  social:
    "gradient-outdoor border-outdoor/30 hover:shadow-outdoor/30 hover:border-outdoor/50",
  adventure:
    "gradient-outdoor border-outdoor/30 hover:shadow-outdoor/30 hover:border-outdoor/50",
};

export const ActivityCard = ({
  activity,
  onAdd,
  onRemove,
}: ActivityCardProps) => {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer rounded-2xl backdrop-blur-sm card-organic texture-overlay",
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
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 hover:bg-white/30 border-white/30 rounded-lg hover:shadow-md hover:-translate-y-0.5 btn-organic"
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
