import { useState, useEffect } from "react";
import { CreatorDisplay } from "@/types/creator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface CreatorFormProps {
  creator?: CreatorDisplay;
  onSubmit: (creator: Omit<CreatorDisplay, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export const CreatorForm = ({ creator, onSubmit, onCancel, isEditing = false, isSubmitting = false }: CreatorFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    imageUrl: "",
    platform: "",
  });

  useEffect(() => {
    if (creator) {
      setFormData({
        name: creator.name,
        url: creator.url,
        description: creator.description,
        imageUrl: creator.imageUrl || "",
        platform: creator.platform,
      });
    }
  }, [creator]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card animate-scale-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
          {isEditing ? "Edit Creator" : "Add New Creator"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Creator's name"
              required
              className="transition-smooth focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform" className="text-sm font-medium">Platform</Label>
            <Input
              id="platform"
              type="text"
              value={formData.platform}
              onChange={(e) => handleChange("platform", e.target.value)}
              placeholder="YouTube, Twitch, TikTok, etc."
              required
              className="transition-smooth focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">Channel URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="https://..."
              required
              className="transition-smooth focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://... (profile picture or content image)"
              className="transition-smooth focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe their content and why they're worth following..."
              required
              rows={4}
              className="transition-smooth focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="hero"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : (
                isEditing ? "Update Creator" : "Add Creator"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};