import { toast } from "@/components/ui/use-toast";

export async function getAIResponse(userInput: string) {
  try {
    // For demo purposes, we'll use the fallback response generator
    // This ensures the app works without requiring an API key
    return generateFallbackResponse(userInput);
  } catch (error) {
    console.error("Error getting AI response:", error);
    toast({
      title: "AI Assistant Error",
      description:
        error instanceof Error
          ? error.message
          : "Failed to connect to AI service",
      variant: "destructive",
    });
    return generateFallbackResponse(userInput);
  }
}

// Fallback response generator when API is unavailable
function generateFallbackResponse(userInput: string) {
  const input = userInput.toLowerCase();
  let response = "Welcome to LumiNIC-Q! ";

  // Default recommendations
  let recommendations = [
    {
      name: "Deep Tissue Massage",
      duration: "60 min",
      category: "Massage",
      price: "$150+",
      reason: "to release tension and improve circulation",
    },
    {
      name: "Hydrating Facial",
      duration: "60 min",
      category: "Skincare",
      price: "$135+",
      reason: "to rejuvenate and moisturize your skin",
    },
  ];

  // Customize based on keywords
  if (
    input.includes("hair") ||
    input.includes("cut") ||
    input.includes("style")
  ) {
    recommendations = [
      {
        name: "Precision Haircut",
        duration: "45 min",
        category: "Haircare",
        price: "$75+",
        reason: "for a fresh, tailored look that suits your face shape",
      },
      {
        name: "Hair Styling & Blowout",
        duration: "60 min",
        category: "Haircare",
        price: "$65+",
        reason: "to give your hair volume, shine and movement",
      },
    ];
  } else if (
    input.includes("skin") ||
    input.includes("face") ||
    input.includes("facial")
  ) {
    recommendations = [
      {
        name: "Anti-Aging Facial",
        duration: "75 min",
        category: "Skincare",
        price: "$165+",
        reason: "to reduce signs of aging with peptides and antioxidants",
      },
      {
        name: "Brightening Vitamin-C Facial",
        duration: "60 min",
        category: "Skincare",
        price: "$155+",
        reason: "to brighten dull skin and reduce hyperpigmentation",
      },
    ];
  } else if (
    input.includes("massage") ||
    input.includes("relax") ||
    input.includes("stress")
  ) {
    recommendations = [
      {
        name: "Swedish Relaxation Massage",
        duration: "60 min",
        category: "Massage",
        price: "$130+",
        reason: "to relieve tension and improve circulation",
      },
      {
        name: "Hot Stone Therapy",
        duration: "75 min",
        category: "Massage",
        price: "$165+",
        reason: "to ease muscle tension with smooth, heated stones",
      },
    ];
  }

  response +=
    "Based on what you've shared, I have some personalized recommendations for you. ";

  recommendations.forEach((rec) => {
    response += `I recommend our ${rec.name} (${rec.duration}) from our ${rec.category} category, priced at ${rec.price}. This would be perfect ${rec.reason}. `;
  });

  response +=
    "Would you like to book one of these services or hear about other options?";

  return response;
}
