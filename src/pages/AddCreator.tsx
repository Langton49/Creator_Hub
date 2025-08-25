import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreatorDisplay } from "@/types/creator";
import { useCreators } from "@/hooks/useCreators";
import { CreatorForm } from "@/components/CreatorForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AddCreator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addCreator } = useCreators();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (creatorData: Omit<CreatorDisplay, 'id' | 'created_at'>) => {
    try {
      setIsSubmitting(true);
      await addCreator(creatorData);
      
      toast({
        title: "Creator Added!",
        description: `${creatorData.name} has been added to your creator list.`,
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add creator. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Creators
          </Link>
        </Button>

        <CreatorForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}