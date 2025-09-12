import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { ActivityCategory } from "@/store/weekendStore";
import { useWeekendStore } from "@/store/weekendStore";
import { cn } from "@/lib/utils";

interface CreateActivityDialogProps {
  isCompact?: boolean;
}

export const CreateActivityDialog = ({
  isCompact = false,
}: CreateActivityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("food");

  const { activities } = useWeekendStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newActivity = {
      id: `custom-${Date.now()}`,
      name,
      description,
      icon,
      category,
    };

    // Add the new activity to the store
    useWeekendStore.setState({ activities: [...activities, newActivity] });

    // Reset form and close dialog
    setName("");
    setDescription("");
    setIcon("");
    setCategory("food");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "border-dashed transition-all duration-300 whitespace-nowrap",
            isCompact ? "w-12 p-2" : "w-full"
          )}
          title={isCompact ? "Create Custom Activity" : undefined}
        >
          <Plus className={cn("h-4 w-4", !isCompact && "mr-2")} />
          {!isCompact && "Create Custom Activity"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="icon">Icon (emoji)</label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Enter an emoji (e.g., 🎨)"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Activity name"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category">Category</label>
            <Select
              value={category}
              onValueChange={(value: ActivityCategory) => setCategory(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="relax">Relax</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Create Activity
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
