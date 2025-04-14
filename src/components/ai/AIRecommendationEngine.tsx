import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAIResponse } from "@/lib/openai";
import { ShoppingCart, Send, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface AIRecommendationEngineProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RecommendedService {
  title: string;
  price: string;
  duration: string;
  category: string;
  description?: string;
  image?: string;
}

export function AIRecommendationEngine({
  open,
  onOpenChange,
}: AIRecommendationEngineProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedServices, setRecommendedServices] = useState<
    RecommendedService[]
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    setAiResponse("");
    setRecommendedServices([]);

    try {
      const response = await getAIResponse(userInput);
      setAiResponse(response);

      // Parse the response to extract service recommendations
      // This is a simplified version - in a real app, you'd have a more robust parsing mechanism
      // or the AI would return structured data
      const serviceMatches = response.match(
        /recommend our ([^(]+)\(([^)]+)\)/g,
      );
      const categoryMatches = response.match(/from our ([a-zA-Z]+) category/g);
      const priceMatches = response.match(/priced at ([^.]+)/g);

      if (serviceMatches && categoryMatches && priceMatches) {
        const services: RecommendedService[] = [];

        for (
          let i = 0;
          i <
          Math.min(
            serviceMatches.length,
            categoryMatches.length,
            priceMatches.length,
          );
          i++
        ) {
          const titleMatch = serviceMatches[i].match(/recommend our ([^(]+)/);
          const durationMatch = serviceMatches[i].match(/\(([^)]+)\)/);
          const categoryMatch = categoryMatches[i].match(
            /from our ([a-zA-Z]+) category/,
          );
          const priceMatch = priceMatches[i].match(/priced at ([^.]+)/);

          if (titleMatch && durationMatch && categoryMatch && priceMatch) {
            // Get appropriate image based on category
            let imageUrl =
              "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80";
            const category = categoryMatch[1].trim().toLowerCase();

            if (category === "skincare") {
              imageUrl =
                "https://images.unsplash.com/photo-1596178060810-72660ee8a9d1?w=800&q=80";
            } else if (category === "massage") {
              imageUrl =
                "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80";
            } else if (category === "wellness") {
              imageUrl =
                "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?w=800&q=80";
            }

            services.push({
              title: titleMatch[1].trim(),
              duration: durationMatch[1].trim(),
              category: category,
              price: priceMatch[1].trim(),
              description: "AI recommended service based on your preferences",
              image: imageUrl,
            });
          }
        }

        setRecommendedServices(services);
      } else {
        // Fallback if parsing fails
        const fallbackServices = [
          {
            title: "Premium Haircut",
            duration: "45 min",
            category: "haircare",
            price: "$75+",
            description: "AI recommended service based on your preferences",
            image:
              "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
          },
          {
            title: "Hydrating Facial",
            duration: "60 min",
            category: "skincare",
            price: "$135+",
            description: "AI recommended service based on your preferences",
            image:
              "https://images.unsplash.com/photo-1596178060810-72660ee8a9d1?w=800&q=80",
          },
        ];
        setRecommendedServices(fallbackServices);
      }
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      toast({
        title: "Recommendation Error",
        description: "Failed to get AI recommendations. Please try again.",
        variant: "destructive",
      });

      // Provide fallback recommendations on error
      const fallbackServices = [
        {
          title: "Premium Haircut",
          duration: "45 min",
          category: "haircare",
          price: "$75+",
          description: "Recommended service based on popular choices",
          image:
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
        },
        {
          title: "Deep Tissue Massage",
          duration: "60 min",
          category: "massage",
          price: "$150+",
          description: "Recommended service based on popular choices",
          image:
            "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
        },
      ];
      setRecommendedServices(fallbackServices);
      setAiResponse(
        "Based on popular choices, here are some services that might interest you. These recommendations are tailored to provide relaxation and rejuvenation.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (service: RecommendedService) => {
    addItem(service);
    toast({
      title: "Added to cart",
      description: `${service.title} has been added to your cart.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>AI Service Recommendations</span>
          </DialogTitle>
          <DialogDescription>
            Tell us about your preferences, concerns, or what you're looking
            for, and our AI will recommend the perfect services for you.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-50 p-4 rounded-xl"
            >
              <p className="text-sm">{aiResponse}</p>

              {recommendedServices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 space-y-3"
                >
                  <h4 className="font-medium text-sm mb-2">
                    Recommended Services:
                  </h4>
                  {recommendedServices.map((service, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-purple-100 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{service.title}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>Duration: {service.duration}</p>
                          <p>Price: {service.price}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full hover:bg-purple-500 hover:text-white transition-colors"
                        onClick={() => handleAddToCart(service)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Textarea
              placeholder="E.g., I have dry skin and need something revitalizing, or I'm experiencing back pain and need relief..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <DialogFooter className="mt-2">
              <Button
                type="submit"
                className="rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
                disabled={isLoading || !userInput.trim()}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Get Recommendations
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
