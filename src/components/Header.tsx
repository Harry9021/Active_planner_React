import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { WeekendLengthSelector } from "./WeekendLengthSelector";
import { WeekendDatePicker } from "./WeekendDatePicker";
import { ExportDialog } from "./ExportDialog";
import { Share, Download, Calendar, Menu, X, LogOut } from "lucide-react";
import { useWeekendStore } from "@/store/weekendStore";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export const Header = () => {
  const { schedule, availableDays, logout, createShareableLink } =
    useWeekendStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const navigate = useNavigate();

  const totalActivities = availableDays.reduce(
    (sum, day) => sum + schedule[day].length,
    0
  );
  const daysCounts = availableDays.map((day) => ({
    day,
    count: schedule[day].length,
  }));

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const handleShare = () => {
    const shareLink = createShareableLink();
    const shareData = {
      title: "My Weekend Plan",
      text: `Check out my weekend plan with ${totalActivities} activities!`,
      url: shareLink,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareLink).then(() => {
        toast({
          title: "Share link copied!",
          description: "Your weekend plan link has been copied to clipboard.",
        });
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title - Fixed width to prevent overlap */}
          <div className="w-[200px] md:w-[250px]">
            <h1 className="text-xl md:text-2xl font-bold gradient-hero bg-clip-text text-transparent truncate">
              Weekend Planner
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
              Plan your perfect weekend adventure
            </p>
          </div>

          {/* Desktop Controls - Center aligned */}
          <div className="hidden lg:flex items-center gap-4 flex-1 justify-center">
            <WeekendDatePicker />
            {/* <WeekendLengthSelector /> */}
          </div>

          <div className="flex gap-2 sm:w-auto">
            <ThemeSwitcher />
          </div>

          {/* Right Side Controls - Fixed width */}
          <div className="hidden lg:flex items-center gap-3 w-[200px] justify-end">
            {/* <ThemeSwitcher /> */}
            <div className="h-6 w-px bg-border" />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleShare}
                className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-lg"
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExport}
                className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-lg"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  logout();
                  navigate("/start");
                }}
                className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Controls Panel - Improved spacing */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-out",
            isMobileMenuOpen ? "max-h-96 py-4" : "max-h-0"
          )}
        >
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <WeekendDatePicker />
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={handleShare}
                className="flex-1 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-lg"
              >
                <Share className="h-4 w-4 mr-2" />
                Share Plan
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExport}
                className="flex-1 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  logout();
                  navigate("/start");
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-lg"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        {totalActivities > 0 && (
          <div className="py-3 animate-fade-in">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 shadow-sm">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary animate-pulse" />
                <span>
                  <strong className="text-primary">{totalActivities}</strong>{" "}
                  activities planned
                  <span className="hidden sm:inline">
                    {" "}
                    across {availableDays.length} days
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {daysCounts
                  .filter(({ count }) => count > 0)
                  .slice(0, 3)
                  .map(({ day, count }) => (
                    <span
                      key={day}
                      className="text-xs px-3 py-1.5 bg-primary/20 text-primary rounded-full backdrop-blur-sm font-medium shadow-sm"
                    >
                      {count}
                      <span className="hidden sm:inline"> {day}</span>
                    </span>
                  ))}
                {daysCounts.filter(({ count }) => count > 0).length > 3 && (
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    +{daysCounts.filter(({ count }) => count > 0).length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />
    </header>
  );
};
