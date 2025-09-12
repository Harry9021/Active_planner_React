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

const Create = () => {
  const navigate = useNavigate();
  const {
    existsThread,
    createThreadWithCredentials,
    markThreadAuthenticated,
    threadHasPassword,
  } = useWeekendStore();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState(searchParams.get("id") ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    if (password !== confirm) {
      toast({
        title: "Passwords do not match",
        description: "Please retype your password",
        variant: "destructive",
      });
      return;
    }
    if (existsThread(id)) {
      // If thread exists but is not secured yet, allow setting password
      if (!threadHasPassword(id)) {
        setIsLoading(true);
        try {
          createThreadWithCredentials(id, trimmed, password);
          markThreadAuthenticated(id);
          toast({
            title: "Account secured",
            description: `Welcome ${trimmed}`,
          });
          navigate(`/t/${id}`);
        } finally {
          setIsLoading(false);
        }
        return;
      } else {
        toast({
          title: "User already exists",
          description: "Try logging in instead",
          variant: "destructive",
        });
        navigate(`/start?id=${encodeURIComponent(id)}`);
        return;
      }
    }

    setIsLoading(true);
    try {
      createThreadWithCredentials(id, trimmed, password);
      markThreadAuthenticated(id);
      toast({ title: "Account created", description: `Welcome ${trimmed}` });
      navigate(`/t/${id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Create your planner</h1>
          <p className="text-sm text-muted-foreground">
            Sign up to start planning
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alex"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Confirm Password</label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !username || !password || !confirm}
          >
            {isLoading ? "Creating..." : "Create account"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <a
            className="underline"
            href={`/start?id=${encodeURIComponent(username)}`}
          >
            Log in
          </a>
        </p>
      </Card>
    </div>
  );
};

export default Create;
