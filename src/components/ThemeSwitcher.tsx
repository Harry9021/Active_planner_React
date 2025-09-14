import { useWeekendStore, ThemeType } from "@/store/weekendStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes: {
  value: ThemeType;
  label: string;
  icon: string;
  description: string;
  color: string;
}[] = [
  {
    value: "default",
    label: "Balanced",
    icon: "⚖️",
    description: "Perfect mix of everything",
    color: "gradient-primary",
  },
  {
    value: "lazy",
    label: "Chill Vibes",
    icon: "😴",
    description: "Low-key relaxation",
    color: "bg-theme-lazy",
  },
  {
    value: "adventurous",
    label: "Adventure",
    icon: "⛰️",
    description: "Outdoor excitement",
    color: "bg-theme-adventurous",
  },
  {
    value: "family",
    label: "Family Fun",
    icon: "👨‍👩‍👧‍👦",
    description: "Activities for everyone",
    color: "bg-theme-family",
  },
];

export const ThemeSwitcher = () => {
  const { currentTheme, setTheme } = useWeekendStore();
  const getCurrentThemeLabel = () => {
    return (
      themes.find((t) => t.value === currentTheme)?.label || "Select Theme"
    );
  };

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              <Palette className="h-4 w-4 mr-2" />
              <span>{getCurrentThemeLabel()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full min-w-[200px]">
            {themes.map((theme) => (
              <DropdownMenuItem
                key={theme.value}
                onClick={() => setTheme(theme.value)}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  currentTheme === theme.value && theme.color
                )}
              >
                <span className="text-lg">{theme.icon}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{theme.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {theme.description}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop View */}
      <Card className="hidden md:flex w-full gap-2 px-1 py-1">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <h3 className="font-medium">Weekend Theme</h3>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {themes.map((theme) => (
            <Button
              key={theme.value}
              variant={currentTheme === theme.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme(theme.value)}
              title={theme.label}
              className={cn(
                "h-auto flex flex-col items-center gap-1 transition-all hover:scale-105",
                currentTheme === theme.value && theme.color
              )}
            >
              <span className="text-lg">{theme.icon}</span>
              {/* <span className="text-xs font-medium">{theme.label}</span> */}
            </Button>
          ))}
        </div>
      </Card>
    </>
  );
};
