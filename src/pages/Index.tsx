import { useState } from "react";
import { Link } from "react-router-dom";
import { CreatorDisplay } from "@/types/creator";
import { useCreators } from "@/hooks/useCreators";
import { CreatorCard } from "@/components/CreatorCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Users, Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { creators, loading, error, deleteCreator } = useCreators();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [creatorToDelete, setCreatorToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const handleEdit = (creator: CreatorDisplay) => {
    // Navigate to edit page - this will be handled by router
    window.location.href = `/edit/${creator.id}`;
  };

  const handleDeleteClick = (id: number) => {
    setCreatorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (creatorToDelete) {
      try {
        const creator = creators.find((c) => c.id === creatorToDelete);
        await deleteCreator(creatorToDelete);

        toast({
          title: "Creator Deleted",
          description: `${creator?.name} has been removed from your list.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete creator. Please try again.",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setCreatorToDelete(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-black">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">
                Discover Amazing Creators
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Your Favorite
              <br />
              <span className="text-primary-glow">Content Creators</span>
            </h1>
            <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover, manage, and explore amazing content creators across
              YouTube, Twitch, TikTok and more. Build your personalized creator
              collection.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="hero" size="lg" asChild className="shadow-glow">
                <Link to="/add">
                  <Plus className="w-5 h-5" />
                  Add New Creator
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-black hover:bg-white/20"
              >
                <Users className="w-5 h-5" />
                Browse {creators.length} Creators
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-glow/20 opacity-50" />
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Creators</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our curated collection of content creators making waves
              across different platforms
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading creators...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-destructive mb-4">Error: {error}</div>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : creators.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No creators yet</h3>
              <p className="text-muted-foreground mb-6">
                Start building your creator collection by adding your first
                creator!
              </p>
              <Button variant="hero" asChild>
                <Link to="/add">
                  <Plus className="w-5 h-5" />
                  Add Your First Creator
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator, index) => (
                <div
                  key={creator.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CreatorCard
                    creator={creator}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Creator</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this creator? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="flex-1"
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
