import React, { useState, useEffect } from "react";
import { useWeekendStore, DayKey } from "@/store/weekendStore";
import { type Activity } from "../store/weekendStore";
import { Header } from "@/components/Header";
import { ActivityList } from "@/components/ActivityList";
import { Schedule } from "@/components/Schedule";
import { HolidayAwareness } from "@/components/HolidayAwareness";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Grid3X3 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const Index = () => {
  const [selectedDay, setSelectedDay] = useState<DayKey>("saturday");
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
  const spaceLabel =
    currentThreadId && threads[currentThreadId]?.ownerUsername
      ? threads[currentThreadId]?.ownerUsername
      : currentThreadId;

  const handleAddActivity = (day: DayKey, selectedActivity: Activity) => {
    addActivity(day, selectedActivity);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/3 to-accent/3">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="activities" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto rounded-xl shadow-sm">
              <TabsTrigger
                value="activities"
                className="flex items-center gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                Activities ({activities.length})
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule ({totalScheduled})
              </TabsTrigger>
            </TabsList>
            {spaceLabel && (
              <div className="text-center text-xs text-muted-foreground">
                Space: {spaceLabel}
              </div>
            )}

            <TabsContent value="activities" className="space-y-6">
              <div className="grid lg:grid-cols-4 gap-6">
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
                  {/* <div className="md:hidden space-y-4">
                    <WeekendLengthSelector />
                    <ThemeSwitcher />
                  </div> */}

                  <HolidayAwareness />

                  <div className="sticky top-24">
                    <Schedule
                      selectedDay={selectedDay}
                      onDaySelect={setSelectedDay}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

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
