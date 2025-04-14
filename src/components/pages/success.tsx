import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle, ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../supabase/auth";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Auto redirect to dashboard after 10 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-lg overflow-hidden"
      >
        <div className="bg-green-50 p-8 flex flex-col items-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-semibold text-center mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 text-center">
            Your appointment has been successfully booked and confirmed.
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Appointment Details</p>
                <p className="font-medium">Check your dashboard for details</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              View My Bookings
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Auto-redirecting to dashboard in {countdown} seconds...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
