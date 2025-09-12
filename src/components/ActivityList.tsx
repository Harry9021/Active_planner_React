import { useState, useEffect } from "react";
import {
  useWeekendStore,
  ActivityCategory,
  DayKey,
} from "@/store/weekendStore";
import { ActivityCard } from "./ActivityCard";
import { CreateActivityDialog } from "./CreateActivityDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Activity } from "../store/weekendStore";

interface ActivityListProps {
  onAddActivity: (activity: Activity) => void;
  selectedDay: DayKey;
}

export const ActivityList = ({
  onAddActivity,
  selectedDay,
}: ActivityListProps) => {
  const { activities, removeCatalogActivity } = useWeekendStore();
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    ActivityCategory | "all"
  >("all");

  const categories: {
    value: ActivityCategory | "all";
    label: string;
    icon: string;
  }[] = [
    { value: "all", label: "All", icon: "✨" },
    { value: "food", label: "Food", icon: "🍽️" },
    { value: "outdoor", label: "Outdoor", icon: "🌲" },
    { value: "entertainment", label: "Entertainment", icon: "🎬" },
    { value: "relax", label: "Relax", icon: "🧘‍♀️" },
    { value: "learning", label: "Learning", icon: "📚" },
    { value: "social", label: "Social", icon: "🧑‍🤝‍🧑" },
    { value: "adventure", label: "Adventure", icon: "⛰️" },
  ];

  const handleSearchClear = () => {
    setSearch("");
    setIsSearchFocused(false);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    if (!search) {
      setIsSearchFocused(false);
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const searchTerms = search
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 0);

    const matchesSearch =
      searchTerms.length === 0 ||
      searchTerms.every(
        (term) =>
          activity.name.toLowerCase().includes(term) ||
          activity.description.toLowerCase().includes(term) ||
          activity.category.toLowerCase().includes(term)
      );

    const matchesCategory =
      selectedCategory === "all" || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  console.log("Total activities:", activities.length);
  console.log("Filtered activities:", filteredActivities.length);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <div
            className={cn(
              "relative transition-all duration-300 ease-out",
              isSearchFocused ? "flex-[3]" : "flex-1"
            )}
          >
            <Search
              className={cn(
                "absolute left-3 top-3 h-4 w-4 transition-colors duration-200",
                isSearchFocused ? "text-primary" : "text-muted-foreground"
              )}
            />
            <Input
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className={cn(
                "pl-10 pr-10 transition-all duration-300",
                isSearchFocused && "ring-2 ring-primary/20 border-primary/50"
              )}
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-destructive/10"
                onClick={handleSearchClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div
            className={cn(
              "transition-all duration-300 ease-out",
              isSearchFocused ? "w-12 overflow-hidden" : "w-auto"
            )}
          >
            <CreateActivityDialog isCompact={isSearchFocused} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={
                selectedCategory === category.value ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className={cn(
                "transition-all",
                selectedCategory === category.value
                  ? "gradient-primary shadow-glow"
                  : "hover:scale-105"
              )}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
        {filteredActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onAdd={() => onAddActivity(activity)}
            onRemove={() => {
              const confirmed = window.confirm(
                `Delete ${activity.name}? This also removes it from schedule.`
              );
              if (confirmed) removeCatalogActivity(activity.id);
            }}
          />
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No activities found. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};
