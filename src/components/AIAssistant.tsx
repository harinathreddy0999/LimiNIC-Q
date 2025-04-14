import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAIResponse } from "@/lib/openai";
import { MessageCircle, Send, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "./ui/use-toast";

interface AIAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIAssistant({ open, onOpenChange }: AIAssistantProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedService, setRecommendedService] = useState<{
    title: string;
    price: string;
    duration: string;
    category: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    setAiResponse("");
    setRecommendedService(null);

    try {
      const response = await getAIResponse(userInput);
      setAiResponse(response);

      // Parse the response to extract service recommendation
      // This is a simplified version - in a real app, you'd have a more robust parsing mechanism
      // or the AI would return structured data
      const serviceMatches = response.match(
        /recommend our ([^(]+)\(([^)]+)\)/g,
      );
      const categoryMatches = response.match(/from our ([a-zA-Z]+) category/g);
      const priceMatches = response.match(/priced at ([^.]+)/g);

      if (
        serviceMatches &&
        serviceMatches.length > 0 &&
        categoryMatches &&
        categoryMatches.length > 0 &&
        priceMatches &&
        priceMatches.length > 0
      ) {
        // Extract the first recommendation
        const serviceMatch = serviceMatches[0].match(/recommend our ([^(]+)/);
        const durationMatch = serviceMatches[0].match(/\(([^)]+)\)/);
        const categoryMatch = categoryMatches[0].match(
          /from our ([a-zA-Z]+) category/,
        );
        const priceMatch = priceMatches[0].match(/priced at ([^.]+)/);

        if (serviceMatch && durationMatch && categoryMatch && priceMatch) {
          setRecommendedService({
            title: serviceMatch[1].trim(),
            duration: durationMatch[1].trim(),
            category: categoryMatch[1].trim(),
            price: priceMatch[1].trim(),
          });
        }
      }
    } catch (error) {
      console.error("Error in AI Assistant:", error);
      toast({
        title: "AI Assistant Error",
        description:
          "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookRecommended = () => {
    if (!recommendedService) return;

    // Navigate to booking page with recommended service details
    navigate(
      `/booking?title=${encodeURIComponent(recommendedService.title)}&price=${encodeURIComponent(recommendedService.price)}&duration=${encodeURIComponent(recommendedService.duration)}&category=${encodeURIComponent(recommendedService.category)}`,
    );

    toast({
      title: "AI Recommendation Selected",
      description: `You're booking ${recommendedService.title}. Please select a date and time.`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>LumiNIC-Q AI Assistant</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">
            Tell me about your preferences, concerns, or what you're looking
            for, and I'll recommend the perfect services for you.
          </p>

          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-50 p-4 rounded-xl"
            >
              <p className="text-sm">{aiResponse}</p>

              {recommendedService && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 bg-white p-4 rounded-lg border border-purple-100"
                >
                  <h4 className="font-medium text-sm mb-2">
                    Recommended Service:
                  </h4>
                  <div className="space-y-1 mb-3">
                    <p className="text-sm">
                      <span className="font-medium">Service:</span>{" "}
                      {recommendedService.title}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Duration:</span>{" "}
                      {recommendedService.duration}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Price:</span>{" "}
                      {recommendedService.price}
                    </p>
                  </div>
                  <Button
                    onClick={handleBookRecommended}
                    size="sm"
                    className="w-full rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book This Service
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
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
                className="w-full rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
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
