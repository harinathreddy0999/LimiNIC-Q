import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "../../../supabase/supabase";
import { motion } from "framer-motion";

interface BookingFormProps {
  serviceTitle?: string;
  servicePrice?: string;
  serviceDuration?: string;
  serviceCategory?: string;
}

export default function BookingForm({
  serviceTitle,
  servicePrice,
  serviceDuration,
  serviceCategory,
}: BookingFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const period = hour < 12 ? "AM" : "PM";
        const formattedMinute = minute === 0 ? "00" : minute;
        slots.push(`${formattedHour}:${formattedMinute} ${period}`);
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleSubmit = async () => {
    if (!date || !time) {
      toast({
        title: "Missing information",
        description: "Please select a date and time for your appointment",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if user is logged in
      if (!user) {
        // Save booking details to localStorage and redirect to login
        localStorage.setItem(
          "pendingBooking",
          JSON.stringify({
            title: serviceTitle,
            price: servicePrice,
            duration: serviceDuration,
            category: serviceCategory,
            date: date.toISOString(),
            time: time,
          }),
        );

        navigate("/login", {
          state: {
            from: "/booking",
            message: "Please sign in to complete your booking",
          },
        });
        return;
      }

      // Create booking in Supabase
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            user_id: user.id,
            service_title: serviceTitle || "Custom Service",
            service_price: servicePrice || "$0",
            service_duration: serviceDuration || "30 min",
            service_category: serviceCategory || "Other",
            booking_date: date.toISOString().split("T")[0],
            booking_time: time,
            status: "pending",
            payment_status: "pending",
            payment_amount: parseFloat(
              servicePrice?.replace(/[^0-9.]/g, "") || "0",
            ),
          },
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setBookingId(data[0].id);
      }

      // Move to payment step
      setStep(2);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Error",
        description:
          "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      if (bookingId) {
        // Update booking status to paid
        const { error: updateError } = await supabase
          .from("bookings")
          .update({ status: "confirmed", payment_status: "paid" })
          .eq("id", bookingId);

        if (updateError) throw updateError;
      } else {
        console.error("No booking ID found");
        throw new Error("No booking ID found");
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to success page
      navigate("/success");
      toast({
        title: "Booking Confirmed",
        description: `Your appointment for ${serviceTitle} has been booked successfully!`,
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
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-md overflow-hidden">
        {step === 1 ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Book Your Appointment
              </CardTitle>
              <CardDescription>
                {serviceTitle ? (
                  <span>
                    You're booking: <strong>{serviceTitle}</strong>
                  </span>
                ) : (
                  "Select a date and time for your appointment"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => {
                    // Disable dates in the past
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="rounded-md border mx-auto"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select Time</h3>
                <Select onValueChange={setTime} value={time}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {serviceTitle && (
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{serviceTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span>{serviceDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold">{servicePrice}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                className="w-full rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
                disabled={isLoading || !date || !time}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Payment Details
              </CardTitle>
              <CardDescription>
                Complete your booking by providing payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">
                    {serviceTitle || "Custom Service"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{date?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span>{time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">{servicePrice || "$0"}</span>
                </div>
              </div>

              {/* Payment form - simplified for demo */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Card Information</h3>
                  <div className="h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                    Demo: Payment details would go here
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handlePayment}
                className="w-full rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ${servicePrice || "$0"}`
                )}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </motion.div>
  );
}
