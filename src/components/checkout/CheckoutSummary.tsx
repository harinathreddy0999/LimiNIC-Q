import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../supabase/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import { Trash2, Calendar, Clock, DollarSign, CreditCard } from "lucide-react";
import stripePromise from "@/lib/stripe";

export default function CheckoutSummary() {
  const { items, removeItem, totalPrice, totalDuration, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add services to your cart before checkout",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      // Save cart to localStorage and redirect to login
      localStorage.setItem("pendingCart", JSON.stringify(items));
      navigate("/login", {
        state: {
          from: "/checkout",
          message: "Please sign in to complete your booking",
        },
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Initialize Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      // Create a payment intent via your backend
      // For demo purposes, we're creating a mock payment session
      const totalAmount = items.reduce((total, item) => {
        const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ""));
        return isNaN(priceValue) ? total : total + priceValue;
      }, 0);

      // In a real app, you would call your backend to create a payment intent
      // const response = await fetch('/api/create-payment-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ items, amount: totalAmount * 100 })
      // });
      // const { clientSecret } = await response.json();

      // For demo, we'll simulate a successful payment
      // Create bookings for each item in cart
      const today = new Date();
      const bookingDate = new Date(today);
      bookingDate.setDate(today.getDate() + 3); // Default booking 3 days from now

      const defaultTime = "2:00 PM";

      // Insert all bookings in a single transaction
      const { data, error } = await supabase.from("bookings").insert(
        items.map((item) => ({
          user_id: user.id,
          service_title: item.title,
          service_price: item.price,
          service_duration: item.duration,
          service_category: item.category || "Other",
          booking_date: bookingDate.toISOString().split("T")[0],
          booking_time: defaultTime,
          status: "paid", // Mark as paid
          payment_id: `demo_${Date.now()}`, // In a real app, this would be the Stripe payment ID
        })),
      );

      if (error) throw error;

      // Clear cart and redirect to success page
      clearCart();
      navigate("/success");
      toast({
        title: "Payment Successful",
        description:
          "Your payment was processed and services have been booked successfully!",
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Error",
        description:
          "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
          <Button
            onClick={() => navigate("/services")}
            className="mt-4 rounded-full"
          >
            Browse Services
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between items-center p-3 border border-gray-100 rounded-lg"
          >
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <div className="flex items-center text-sm text-gray-500 space-x-3">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> {item.duration}
                </span>
                <span className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" /> {item.price}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}

        <div className="pt-4 border-t border-gray-100 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Duration:</span>
            <span className="font-medium">{totalDuration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Price:</span>
            <span className="font-semibold text-lg">{totalPrice}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCheckout}
          className="w-full rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" /> Pay and Book
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
