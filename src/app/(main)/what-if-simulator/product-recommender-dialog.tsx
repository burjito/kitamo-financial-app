
"use client"

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Lightbulb, Loader2 } from "lucide-react";
import Link from "next/link";
import { recommendProducts, ProductRecommendation } from "@/ai/flows/product-recommender-flow";

interface ProductRecommenderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    scenario: {
        monthlyIncome: number;
        monthlyExpenses: number;
        savingsGoal: number;
        timeframe: number;
        goalType: string;
    };
}

export const ProductRecommenderDialog = ({ open, onOpenChange, scenario }: ProductRecommenderDialogProps) => {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const fetchRecommendations = async () => {
        setIsLoading(true);
        setError(null);
        setRecommendations([]);
        try {
          const result = await recommendProducts(scenario);
          setRecommendations(result.recommendations);
        } catch (err) {
          setError("Sorry, I couldn't fetch recommendations right now. Please try again later.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecommendations();
    }
  }, [open, scenario]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Finding the best products for you...</p>
        </div>
      );
    }

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center text-center space-y-4 h-48">
                <p className="text-destructive">{error}</p>
                <Button onClick={() => onOpenChange(false)}>Close</Button>
            </div>
        )
    }

    if (recommendations.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center text-center space-y-4 h-48">
                <p className="text-muted-foreground">No specific product recommendations at this time.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {recommendations.map((rec, index) => (
                 <Card key={index} className="bg-secondary/10">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-primary">{rec.productName}</h3>
                            <Badge>{rec.productType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.recommendationReason}</p>
                        <p className="text-xs text-muted-foreground pt-2">{rec.clarification}</p>
                        <DialogFooter className="pt-4">
                            <Button asChild className="w-full">
                                <Link href={rec.url} target="_blank">
                                    Learn More <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </DialogFooter>
                    </CardContent>
                 </Card>
            ))}
        </div>
    )

  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI Product Recommendations
          </DialogTitle>
          <DialogDescription>
            Based on your scenario, here are some BPI products that might help you reach your goals faster.
          </DialogDescription>
        </DialogHeader>
        
        {renderContent()}

      </DialogContent>
    </Dialog>
  )
};

    