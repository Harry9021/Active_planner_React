import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Play,
  Calendar,
  Plus,
  Target,
  Users,
  Share2,
  Download,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Sparkles,
  Clock,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideProps {
  onStartPlanning?: () => void;
}

export const Guide = ({ onStartPlanning }: GuideProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "welcome",
      title: "Welcome to Weekend Planner!",
      icon: <Sparkles className="h-6 w-6" />,
      description: "Plan your perfect weekend with ease",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold mb-2">
              Let's Plan Your Weekend!
            </h3>
            <p className="text-muted-foreground">
              This guide will walk you through everything you need to know to
              create amazing weekend plans.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Plan Activities</h4>
              <p className="text-sm text-muted-foreground">
                Choose from hundreds of activities
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/5">
              <Target className="h-8 w-8 text-accent mx-auto mb-2" />
              <h4 className="font-semibold">Schedule Your Time</h4>
              <p className="text-sm text-muted-foreground">
                Organize activities by day and time
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/5">
              <Share2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold">Share & Export</h4>
              <p className="text-sm text-muted-foreground">
                Share your plans with friends
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "dashboard",
      title: "Dashboard Overview",
      icon: <Target className="h-6 w-6" />,
      description: "Understand your planning progress",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Your Planning Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Track your weekend planning progress
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Quick Stats</h4>
                <p className="text-sm text-muted-foreground">
                  See how many activities you've planned and your progress
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Planning Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Visual progress bar shows how complete your weekend is
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Category Overview</h4>
                <p className="text-sm text-muted-foreground">
                  See how your activities are distributed across different types
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "activities",
      title: "Adding Activities",
      icon: <Plus className="h-6 w-6" />,
      description: "Browse and add activities to your weekend",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent/10">
              <Plus className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Activity Library</h3>
              <p className="text-sm text-muted-foreground">
                Choose from our curated collection of activities
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-2xl">🔍</div>
              <div>
                <h4 className="font-medium">Search & Filter</h4>
                <p className="text-sm text-muted-foreground">
                  Use the search bar to find specific activities or filter by
                  category
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-2xl">📱</div>
              <div>
                <h4 className="font-medium">Mobile Optimized</h4>
                <p className="text-sm text-muted-foreground">
                  Cards are sized perfectly for mobile - tap to add activities
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-2xl">➕</div>
              <div>
                <h4 className="font-medium">Create Custom Activities</h4>
                <p className="text-sm text-muted-foreground">
                  Don't see what you want? Create your own custom activities
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-2xl">📄</div>
              <div>
                <h4 className="font-medium">View More Button</h4>
                <p className="text-sm text-muted-foreground">
                  On mobile, only 6 activities show at a time. Use "View More"
                  to see additional activities
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "schedule",
      title: "Building Your Schedule",
      icon: <Calendar className="h-6 w-6" />,
      description: "Organize activities by day and time",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Calendar className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold">Schedule Management</h3>
              <p className="text-sm text-muted-foreground">
                Organize your activities by day and time
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-2xl">📅</div>
              <div>
                <h4 className="font-medium">Day Selection</h4>
                <p className="text-sm text-muted-foreground">
                  Choose which day you're planning for (Saturday/Sunday)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-2xl">⏰</div>
              <div>
                <h4 className="font-medium">Time Slots</h4>
                <p className="text-sm text-muted-foreground">
                  Activities are organized into morning, afternoon, evening, and
                  night slots
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-2xl">🔄</div>
              <div>
                <h4 className="font-medium">Easy Management</h4>
                <p className="text-sm text-muted-foreground">
                  Drag to reorder, click to remove activities from your schedule
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "share",
      title: "Sharing & Exporting",
      icon: <Share2 className="h-6 w-6" />,
      description: "Share your plans with friends and family",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Share2 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold">Share Your Plans</h3>
              <p className="text-sm text-muted-foreground">
                Multiple ways to share and save your weekend plans
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-2xl">📱</div>
              <div>
                <h4 className="font-medium">Native Sharing</h4>
                <p className="text-sm text-muted-foreground">
                  Use your device's built-in sharing to send via text, email, or
                  social media
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-2xl">📄</div>
              <div>
                <h4 className="font-medium">PDF Export</h4>
                <p className="text-sm text-muted-foreground">
                  Generate a beautiful PDF with your name and weekend dates
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-2xl">🖼️</div>
              <div>
                <h4 className="font-medium">Image Export</h4>
                <p className="text-sm text-muted-foreground">
                  Save as an image to share on social media
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-2xl">📋</div>
              <div>
                <h4 className="font-medium">Copy to Clipboard</h4>
                <p className="text-sm text-muted-foreground">
                  Quickly copy your schedule as text
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "tips",
      title: "Pro Tips",
      icon: <Lightbulb className="h-6 w-6" />,
      description: "Get the most out of your weekend planning",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-semibold">Pro Tips for Better Planning</h3>
              <p className="text-sm text-muted-foreground">
                Expert advice to make your weekends amazing
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Badge variant="secondary" className="mt-0.5">
                Tip 1
              </Badge>
              <div>
                <h4 className="font-medium">Mix Activity Types</h4>
                <p className="text-sm text-muted-foreground">
                  Balance active and relaxing activities for a well-rounded
                  weekend
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Badge variant="secondary" className="mt-0.5">
                Tip 2
              </Badge>
              <div>
                <h4 className="font-medium">Consider Travel Time</h4>
                <p className="text-sm text-muted-foreground">
                  Factor in travel time between activities when planning your
                  schedule
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Badge variant="secondary" className="mt-0.5">
                Tip 3
              </Badge>
              <div>
                <h4 className="font-medium">Plan Backup Activities</h4>
                <p className="text-sm text-muted-foreground">
                  Have indoor alternatives ready in case of bad weather
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Badge variant="secondary" className="mt-0.5">
                Tip 4
              </Badge>
              <div>
                <h4 className="font-medium">Share Early</h4>
                <p className="text-sm text-muted-foreground">
                  Share your plans with friends early so they can join in
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-primary">
            Weekend Planner Guide
          </h2>
        </div>
        <p className="text-muted-foreground">
          Learn how to create amazing weekend plans in just a few steps
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                index === activeStep
                  ? "bg-primary scale-125"
                  : index < activeStep
                  ? "bg-primary/60"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {steps.map((step, index) => (
          <Button
            key={step.id}
            variant={index === activeStep ? "default" : "outline"}
            size="sm"
            onClick={() => goToStep(index)}
            className={cn(
              "flex items-center gap-2",
              index === activeStep && "gradient-primary shadow-glow"
            )}
          >
            {step.icon}
            <span className="hidden sm:inline">{step.title}</span>
          </Button>
        ))}
      </div>

      {/* Current Step Content */}
      <Card className="gradient-hero border-primary/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {steps[activeStep].icon}
            <CardTitle className="text-primary-foreground">
              {steps[activeStep].title}
            </CardTitle>
          </div>
          <CardDescription className="text-primary-foreground/80">
            {steps[activeStep].description}
          </CardDescription>
        </CardHeader>
        <CardContent>{steps[activeStep].content}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={activeStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          Step {activeStep + 1} of {steps.length}
        </div>

        {activeStep === steps.length - 1 ? (
          <Button
            onClick={onStartPlanning}
            className="flex items-center gap-2 gradient-primary shadow-glow"
          >
            <Play className="h-4 w-4" />
            Start Planning!
          </Button>
        ) : (
          <Button onClick={nextStep} className="flex items-center gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Quick Start */}
      <Card className="border-dashed border-2 border-primary/30">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="font-semibold mb-2">Ready to Start?</h3>
          <p className="text-muted-foreground mb-4">
            Skip the guide and jump straight into planning your weekend
          </p>
          <Button
            onClick={onStartPlanning}
            size="lg"
            className="gradient-primary shadow-glow"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Planning Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
