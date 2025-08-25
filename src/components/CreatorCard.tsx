import { CreatorDisplay } from "@/types/creator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface CreatorCardProps {
  creator: CreatorDisplay;
  onEdit: (creator: CreatorDisplay) => void;
  onDelete: (id: number) => void;
}

export const CreatorCard = ({ creator, onEdit, onDelete }: CreatorCardProps) => {
  return (
    <Card className="group shadow-card hover:shadow-glow transition-spring animate-fade-in bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {creator.imageUrl && (
              <div className="relative">
                <img
                  src={creator.imageUrl}
                  alt={creator.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-10 transition-smooth" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Link to={`/creator/${creator.id}`}>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth truncate">
                  {creator.name}
                </h3>
              </Link>
              <Badge variant="secondary" className="text-xs mt-1">
                {creator.platform}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onEdit(creator)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(creator.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
          {creator.description}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex-1"
            asChild
          >
            <a href={creator.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
              Visit Channel
            </a>
          </Button>
          <Button
            variant="card"
            size="sm"
            className="text-xs"
            asChild
          >
            <Link to={`/creator/${creator.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};