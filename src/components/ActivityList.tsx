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
import { Search, Filter, X, ChevronDown } from "lucide-react";
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
  const [visibleCount, setVisibleCount] = useState(6);
  const [isMobile, setIsMobile] = useState(false); // ✅ track screen size

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const handleSearchFocus = () => setIsSearchFocused(true);
  const handleSearchBlur = () => !search && setIsSearchFocused(false);

  useEffect(() => {
    setVisibleCount(6); // Reset count when filters change
  }, [search, selectedCategory]);

  const handleViewMore = () => setVisibleCount((prev) => prev + 6);
  const handleViewLess = () => setVisibleCount(6);

  const filteredActivities = activities.filter((activity) => {
    const searchTerms = search.toLowerCase().split(" ").filter(Boolean);
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

  // ✅ Show all activities on PC, limited on mobile
  const visibleActivities = isMobile
    ? filteredActivities.slice(0, visibleCount)
    : filteredActivities;

  const hasMoreActivities = isMobile && filteredActivities.length > visibleCount;

  return (
    <div className="space-y-6">
      {/* Search + Add Activity */}
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

        {/* Category Buttons */}
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

      {/* Activity Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
        {visibleActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onAdd={() => onAddActivity(activity)}
            onRemove={() => {
              if (
                window.confirm(
                  `Delete ${activity.name}? This also removes it from schedule.`
                )
              )
                removeCatalogActivity(activity.id);
            }}
          />
        ))}
      </div>

      {/* View More / Show Less - only on mobile */}
      {isMobile && filteredActivities.length > 0 && (
        <div className="flex justify-center pt-4">
          {hasMoreActivities ? (
            <Button
              variant="outline"
              onClick={handleViewMore}
              className="flex items-center gap-2 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <ChevronDown className="h-4 w-4" />
              View More ({filteredActivities.length - visibleCount} remaining)
            </Button>
          ) : visibleCount > 6 ? (
            <Button
              variant="outline"
              onClick={handleViewLess}
              className="flex items-center gap-2 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <ChevronDown className="h-4 w-4 rotate-180" />
              Show Less
            </Button>
          ) : null}
        </div>
      )}

      {/* Empty State */}
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
