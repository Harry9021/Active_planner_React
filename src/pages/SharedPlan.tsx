import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useWeekendStore } from "@/store/weekendStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const SharedPlan = () => {
  const { shareId } = useParams();
  const { getSharedPlan } = useWeekendStore();
  
  if (!shareId) {
    return <Navigate to="/start" replace />;
  }

  const sharedPlan = getSharedPlan(shareId);
  
  if (!sharedPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">Plan Not Found</CardTitle>
            <CardDescription>
              This shared weekend plan doesn't exist or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => window.location.href = '/start'}
              className="w-full"
            >
              Create Your Own Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dayNames = {
    thursday: "Thursday",
    friday: "Friday", 
    saturday: "Saturday",
    sunday: "Sunday"
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-hero bg-clip-text text-transparent">
                {sharedPlan.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Shared on {format(new Date(sharedPlan.createdAt), 'PPP')}
              </p>
            </div>
            <Button
              onClick={() => window.location.href = '/start'}
              variant="outline"
            >
              Create Your Own
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Plan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekend Overview
              </CardTitle>
              <CardDescription>
                {sharedPlan.totalActivities} activities planned across {sharedPlan.availableDays.length} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="capitalize">
                  {sharedPlan.weekendLength} Weekend
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {sharedPlan.currentTheme} Theme
                </Badge>
                {sharedPlan.selectedWeekendDates.length > 0 && (
                  <Badge variant="outline">
                    {format(new Date(sharedPlan.selectedWeekendDates[0]), 'MMM d')} - {' '}
                    {format(new Date(sharedPlan.selectedWeekendDates[sharedPlan.selectedWeekendDates.length - 1]), 'MMM d')}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Daily Schedule */}
          {sharedPlan.availableDays.map((day) => {
            const dayActivities = sharedPlan.schedule[day];
            if (dayActivities.length === 0) return null;

            return (
              <Card key={day}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {dayNames[day]}
                  </CardTitle>
                  <CardDescription>
                    {dayActivities.length} activities planned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {dayActivities.map((activity) => (
                      <div
                        key={activity.scheduledId}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                      >
                        <span className="text-2xl">{activity.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{activity.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {activity.description}
                          </p>
                          {activity.mood && (
                            <Badge variant="outline" className="mt-1 text-xs capitalize">
                              {activity.mood}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Share Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Like this plan?</h3>
                  <p className="text-muted-foreground">
                    Create your own personalized weekend plan
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.href = '/start'}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Start Planning Your Weekend
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SharedPlan;