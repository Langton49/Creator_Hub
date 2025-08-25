import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CreatorDisplay } from "@/types/creator";
import { useCreators } from "@/hooks/useCreators";
import { CreatorForm } from "@/components/CreatorForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditCreator() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCreatorById, updateCreator } = useCreators();
  const [creator, setCreator] = useState<CreatorDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreator = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const foundCreator = await getCreatorById(parseInt(id));
        setCreator(foundCreator);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load creator');
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id, getCreatorById]);

  const handleSubmit = async (creatorData: Omit<CreatorDisplay, 'id' | 'created_at'>) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await updateCreator(parseInt(id), creatorData);
      
      toast({
        title: "Creator Updated!",
        description: `${creatorData.name} has been successfully updated.`,
      });
      
      navigate(`/creator/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update creator. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/creator/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            {error ? 'Error loading creator' : 'Creator not found'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {error || "The creator you're trying to edit doesn't exist."}
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to={`/creator/${id}`}>
            <ArrowLeft className="w-4 h-4" />
            Back to Creator
          </Link>
        </Button>

        <CreatorForm
          creator={creator}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}