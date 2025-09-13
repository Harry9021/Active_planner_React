import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWeekendStore } from "@/store/weekendStore";
import { toast } from "@/components/ui/use-toast";
import { Guide } from "@/components/Guide";
import {
  LogIn,
  BookOpen,
  Calendar,
  Target,
  Plus,
  Share2,
  Sparkles,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";

const normalizeId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

const Start = () => {
  const navigate = useNavigate();
  const {
    existsThread,
    validateThreadPassword,
    markThreadAuthenticated,
    threadHasPassword,
  } = useWeekendStore();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState(searchParams.get("id") ?? "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // No auto-forwarding; user must create or enter a space

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    const id = normalizeId(trimmed);
    if (!id) {
      toast({
        title: "Enter a username",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }
    if (!password) {
      toast({
        title: "Enter a password",
        description: "Password is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // If a space already exists, require correct password
      if (existsThread(id)) {
        const ok = validateThreadPassword(id, password);
        if (!ok) {
          toast({
            title: "Invalid credentials",
            description: "Wrong username or password",
            variant: "destructive",
          });
          return;
        }
        markThreadAuthenticated(id);
        toast({ title: "Welcome back", description: `${trimmed || id}` });
        navigate(`/t/${id}`);
        return;
      }

      // Space does not exist: go to create flow with prefilled id
      navigate(`/create?id=${encodeURIComponent(id)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartPlanning = () => {
    // Switch to login tab and focus on username field
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Weekend Planner</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plan your perfect weekend with ease. Choose activities, schedule
            your time, and share your plans with friends.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto rounded-xl shadow-sm">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Get Started</span>
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>How It Works</span>
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-6">
            <Card className="w-full max-w-md mx-auto p-8 space-y-6 rounded-2xl shadow-xl border-primary/20 backdrop-blur-sm card-organic texture-overlay">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Enter Your Planner
                </h2>
                <p className="text-muted-foreground">
                  Create your private planning space
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Username
                  </label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. alex"
                    className="rounded-lg border-primary/20 focus:border-primary/40 input-organic"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-lg border-primary/20 focus:border-primary/40 input-organic"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-lg btn-organic"
                  disabled={isLoading || !username || !password}
                >
                  {isLoading ? "Creating..." : "Enter my planner"}
                </Button>
              </form>
              <div className="text-xs text-muted-foreground flex items-center justify-between">
                <span>This demo uses local storage namespaces per URL.</span>
                <a
                  className="underline"
                  href={`/create?id=${encodeURIComponent(username)}`}
                >
                  Create account
                </a>
              </div>
            </Card>
          </TabsContent>

          {/* Guide Tab */}
          <TabsContent value="guide" className="space-y-6">
            <div className="max-w-3xl mx-auto">
              {/* Quick Preview */}
              <Card className="gradient-hero border-primary/20 shadow-xl mb-6">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                    <CardTitle className="text-primary-foreground">
                      Welcome to Weekend Planner!
                    </CardTitle>
                  </div>
                  <CardDescription className="text-primary-foreground/80">
                    Plan your perfect weekend with ease
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-primary-foreground/10">
                      <Calendar className="h-8 w-8 text-primary-foreground mx-auto mb-2" />
                      <h4 className="font-semibold text-primary-foreground">
                        Plan Activities
                      </h4>
                      <p className="text-sm text-primary-foreground/80">
                        Choose from hundreds of activities
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-primary-foreground/10">
                      <Target className="h-8 w-8 text-primary-foreground mx-auto mb-2" />
                      <h4 className="font-semibold text-primary-foreground">
                        Schedule Your Time
                      </h4>
                      <p className="text-sm text-primary-foreground/80">
                        Organize activities by day and time
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-primary-foreground/10">
                      <Share2 className="h-8 w-8 text-primary-foreground mx-auto mb-2" />
                      <h4 className="font-semibold text-primary-foreground">
                        Share & Export
                      </h4>
                      <p className="text-sm text-primary-foreground/80">
                        Share your plans with friends
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feature Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Plus className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Activity Library</h3>
                        <p className="text-sm text-muted-foreground">
                          Browse hundreds of curated activities including food,
                          outdoor adventures, entertainment, and more.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Calendar className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Smart Scheduling</h3>
                        <p className="text-sm text-muted-foreground">
                          Organize activities by day and time slots. Drag to
                          reorder and easily manage your weekend.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <Target className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">
                          Progress Tracking
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Visual dashboard shows your planning progress and
                          activity distribution across categories.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Share2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Easy Sharing</h3>
                        <p className="text-sm text-muted-foreground">
                          Export your plans as PDF, image, or share via native
                          device sharing. Perfect for group planning.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Call to Action */}
              <Card className="border-dashed border-2 border-primary/30">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="font-semibold mb-2">
                    Ready to Start Planning?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your account and start planning amazing weekends
                    today!
                  </p>
                  <Button
                    onClick={handleStartPlanning}
                    size="lg"
                    className="gradient-primary shadow-glow"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Get Started Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Start;
