import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWeekendStore } from "@/store/weekendStore";
import { toast } from "@/components/ui/use-toast";

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Card className="w-full max-w-sm p-8 space-y-6 rounded-2xl shadow-xl border-primary/20 backdrop-blur-sm card-organic texture-overlay">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Your Weekend Planner
          </h1>
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
    </div>
  );
};

export default Start;
