import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CreatorDisplay } from "@/types/creator";
import { useCreators } from "@/hooks/useCreators";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Edit, Loader2 } from "lucide-react";

export default function CreatorDetail() {
  const { id } = useParams<{ id: string }>();
  const { getCreatorById } = useCreators();
  const [creator, setCreator] = useState<CreatorDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreator = async () => {
      if (!id) {
        console.log("No id found in params");
        return;
      }
      try {
        setLoading(true);
        console.log("Fetching creator with id:", id);
        const foundCreator = await getCreatorById(parseInt(id));
        console.log("Found creator:", foundCreator);
        setCreator(foundCreator);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load creator");
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id, getCreatorById]);

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
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              {error ? "Error loading creator" : "Creator not found"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {error || "The creator you're looking for doesn't exist."}
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Creators
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card animate-fade-in">
            <CardHeader className="text-center">
              {creator.imageUrl && (
                <div className="mx-auto mb-6 relative">
                  <img
                    src={creator.imageUrl}
                    alt={creator.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-10" />
                </div>
              )}
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                  {creator.name}
                </CardTitle>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {creator.platform}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {creator.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button variant="hero" size="lg" className="flex-1" asChild>
                  <a
                    href={creator.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Visit {creator.platform} Channel
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="flex-1" asChild>
                  <Link to={`/edit/${creator.id}`}>
                    <Edit className="w-5 h-5" />
                    Edit Creator
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
