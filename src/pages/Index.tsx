import React, { useState, useEffect, useRef } from "react";
import { useWeekendStore, DayKey } from "@/store/weekendStore";
import { type Activity } from "../store/weekendStore";
import { Header } from "@/components/Header";
import { ActivityList } from "@/components/ActivityList";
import { Schedule } from "@/components/Schedule";
import { HolidayAwareness } from "@/components/HolidayAwareness";
import { Guide } from "@/components/Guide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Grid3X3,
  ArrowDown,
  Plus,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  Users,
  MapPin,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Index = () => {
  const [selectedDay, setSelectedDay] = useState<DayKey>("saturday");
  const [activeTab, setActiveTab] = useState("dashboard"); // Will be updated based on user status
  const activityListRef = useRef<HTMLDivElement>(null);
  const {
    addActivity,
    availableDays,
    existsThread,
    switchThread,
    isThreadAuthenticated,
    activities,
    schedule,
    currentThreadId,
    threads,
    selectedWeekendDates,
    weekendLength,
  } = useWeekendStore();
  const params = useParams();
  const navigate = useNavigate();

  // Ensure per-thread state exists and is selected
  useEffect(() => {
    const id = params.threadId;
    if (!id) return;
    if (!existsThread(id)) {
      navigate(`/start?id=${encodeURIComponent(id)}`, { replace: true });
      return;
    }
    if (!isThreadAuthenticated(id)) {
      navigate(`/start?id=${encodeURIComponent(id)}`, { replace: true });
      return;
    }
    switchThread(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.threadId]);

  // Simple guard: redirect to /start if threadId is missing
  useEffect(() => {
    if (!params.threadId) {
      navigate("/start", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure selected day is valid for current weekend length
  useEffect(() => {
    if (!availableDays.includes(selectedDay)) {
      setSelectedDay(availableDays[0]);
    }
  }, [availableDays, selectedDay]);

  const totalScheduled = availableDays.reduce(
    (sum, day) => sum + schedule[day].length,
    0
  );

  // Check if user has any activities planned to determine if they're new
  const isNewUser = activities.length === 0 && totalScheduled === 0;

  // Set initial tab based on user status
  useEffect(() => {
    if (isNewUser) {
      setActiveTab("guide");
    } else {
      setActiveTab("dashboard");
    }
  }, [isNewUser]);
  const spaceLabel =
    currentThreadId && threads[currentThreadId]?.ownerUsername
      ? threads[currentThreadId]?.ownerUsername
      : currentThreadId;

  const handleAddActivity = (day: DayKey, selectedActivity: Activity) => {
    addActivity(day, selectedActivity);
  };

  // Dashboard helper functions
  const scrollToActivities = () => {
    setActiveTab("activities");
    setTimeout(() => {
      activityListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const formatDate = (date: string | number | Date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return ""; // return empty if invalid date
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getUserName = () => {
    const currentThread = threads[currentThreadId];
    return currentThread?.ownerUsername || "Weekend Planner User";
  };

  const getPlanningProgress = () => {
    const totalPossible = availableDays.length * 4; // Assume 4 activities per day as ideal
    const currentTotal = totalScheduled;
    return Math.min((currentTotal / totalPossible) * 100, 100);
  };

  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    availableDays.forEach((day) => {
      schedule[day].forEach((activity) => {
        stats[activity.category] = (stats[activity.category] || 0) + 1;
      });
    });
    return stats;
  };

  const getNextSuggestedDay = () => {
    const dayStats = availableDays.map((day) => ({
      day,
      count: schedule[day].length,
    }));
    const minDay = dayStats.reduce((min, current) =>
      current.count < min.count ? current : min
    );
    return minDay.day;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/3 to-accent/3">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto rounded-xl shadow-sm">
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Guide</span>
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="flex items-center gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">
                  Activities ({activities.length})
                </span>
                <span className="sm:hidden">Plan</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">
                  Schedule ({totalScheduled})
                </span>
                <span className="sm:hidden">View</span>
              </TabsTrigger>
            </TabsList>

            {spaceLabel && (
              <div className="text-center text-xs text-muted-foreground">
                Space: {spaceLabel}
              </div>
            )}

            {/* Guide Tab */}
            <TabsContent value="guide" className="space-y-6">
              <Guide onStartPlanning={() => setActiveTab("activities")} />
            </TabsContent>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Hero Welcome Section */}
              <Card className="gradient-hero border-primary/20 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center mb-2">
                    <Sparkles className="h-6 w-6 text-primary-foreground mr-2" />
                    <CardTitle className="text-2xl md:text-3xl text-primary-foreground">
                      Welcome back, {getUserName()}!
                    </CardTitle>
                  </div>
                  <CardDescription className="text-primary-foreground/80 text-lg">
                    {selectedWeekendDates.length > 0
                      ? `Planning for ${selectedWeekendDates
                          .map(formatDate)
                          .join(" - ")}`
                      : `Let's plan your ${weekendLength} weekend!`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    size="lg"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={scrollToActivities}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Let's Plan!
                    <ArrowDown className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">
                      {totalScheduled}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Activities Planned
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Calendar className="h-8 w-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold text-accent">
                      {availableDays.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Days Available
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-500">
                      {Math.round(getPlanningProgress())}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Planning Progress
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-500">
                      {activities.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Activities
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Planning Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Planning Progress
                  </CardTitle>
                  <CardDescription>
                    Track your weekend planning completion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{Math.round(getPlanningProgress())}%</span>
                    </div>
                    <Progress value={getPlanningProgress()} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {availableDays.map((day) => (
                      <div
                        key={day}
                        className="text-center p-2 rounded-lg bg-muted/50"
                      >
                        <div className="font-medium capitalize">{day}</div>
                        <div className="text-sm text-muted-foreground">
                          {schedule[day].length} activities
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Activity Categories
                  </CardTitle>
                  <CardDescription>
                    See how your activities are distributed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(getCategoryStats()).map(
                      ([category, count]) => (
                        <div
                          key={category}
                          className="text-center p-3 rounded-lg border hover:shadow-md transition-shadow"
                        >
                          <div className="text-lg font-bold text-primary">
                            {count}
                          </div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {category}
                          </div>
                        </div>
                      )
                    )}
                    {Object.keys(getCategoryStats()).length === 0 && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No activities planned yet</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={scrollToActivities}
                        >
                          Start Planning
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActiveTab("activities")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">Add Activities</h3>
                        <p className="text-sm text-muted-foreground">
                          Browse and add new activities
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActiveTab("schedule")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">View Schedule</h3>
                        <p className="text-sm text-muted-foreground">
                          See your planned weekend
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActiveTab("guide")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">View Guide</h3>
                        <p className="text-sm text-muted-foreground">
                          Learn how to use the app
                        </p>
                      </div>
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Holiday Awareness */}
              <HolidayAwareness />
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <div ref={activityListRef} className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Choose Your Activities
                    </h2>
                    <p className="text-muted-foreground">
                      Select activities to add to your {selectedDay} schedule
                    </p>
                  </div>
                  <ActivityList
                    selectedDay={selectedDay}
                    onAddActivity={(activity) =>
                      handleAddActivity(selectedDay, activity)
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="sticky top-24">
                    <Schedule
                      selectedDay={selectedDay}
                      onDaySelect={setSelectedDay}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <div className="max-w-4xl mx-auto">
                <Schedule
                  selectedDay={selectedDay}
                  onDaySelect={setSelectedDay}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
