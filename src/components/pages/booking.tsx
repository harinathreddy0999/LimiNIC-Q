import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingForm from "../booking/BookingForm";
import { useAuth } from "../../../supabase/auth";
import { LoadingScreen } from "../ui/loading-spinner";
import { motion } from "framer-motion";

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [serviceDetails, setServiceDetails] = useState({
    title: "",
    price: "",
    duration: "",
    category: "",
  });

  useEffect(() => {
    // Extract service details from URL query params if present
    const params = new URLSearchParams(location.search);
    const title = params.get("title");
    const price = params.get("price");
    const duration = params.get("duration");
    const category = params.get("category");

    if (title && price && duration && category) {
      setServiceDetails({
        title,
        price,
        duration,
        category,
      });
    }
  }, [location.search]);

  // Store booking details in localStorage if user is not logged in
  useEffect(() => {
    if (!loading && !user && serviceDetails.title) {
      // Save booking details to localStorage
      localStorage.setItem("pendingBooking", JSON.stringify(serviceDetails));

      navigate("/login", {
        state: {
          from: "/booking",
          message: "Please sign in to complete your booking",
        },
      });
    }
  }, [user, loading, navigate, serviceDetails]);

  if (loading) {
    return <LoadingScreen text="Loading booking page..." />;
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-semibold tracking-tight mb-4">
            Book Your Appointment
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Select your preferred date and time for your appointment
          </p>
        </div>

        <BookingForm
          serviceTitle={serviceDetails.title}
          servicePrice={serviceDetails.price}
          serviceDuration={serviceDetails.duration}
          serviceCategory={serviceDetails.category}
        />
      </motion.div>
    </div>
  );
}
