import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  aiTag?: string;
  category?: string;
}

export default function ServiceCard({
  title,
  description,
  price,
  duration,
  image,
  aiTag,
  category,
}: ServiceCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addItem } = useCart();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative">
        <img src={image} alt={title} className="w-full h-64 object-cover" />
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {duration}
        </div>
        {aiTag && (
          <div className="absolute bottom-4 left-4 bg-purple-600/90 text-white px-3 py-1 rounded-full text-xs font-medium">
            AI: {aiTag}
          </div>
        )}
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-medium mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">{price}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-blue-500 hover:text-white"
              onClick={() => {
                addItem({
                  title,
                  price,
                  duration,
                  category,
                  image,
                });
                toast({
                  title: "Added to cart",
                  description: `${title} has been added to your cart.`,
                });
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-black hover:text-white"
              onClick={() => {
                // Always navigate to booking page with service details
                navigate(
                  `/booking?title=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}&duration=${encodeURIComponent(duration)}&category=${encodeURIComponent(category || "")}`,
                );
                toast({
                  title: "Booking initiated",
                  description: `You're booking ${title}. Please select a date and time.`,
                });
              }}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
