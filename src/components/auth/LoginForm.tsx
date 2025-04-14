import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to LumiNIC-Q",
        duration: 3000,
      });

      // Check if there's a pending booking
      const pendingBooking = localStorage.getItem("pendingBooking");
      if (pendingBooking) {
        const bookingDetails = JSON.parse(pendingBooking);
        localStorage.removeItem("pendingBooking");
        navigate(
          `/booking?title=${encodeURIComponent(bookingDetails.title)}&price=${encodeURIComponent(bookingDetails.price)}&duration=${encodeURIComponent(bookingDetails.duration)}&category=${encodeURIComponent(bookingDetails.category || "")}`,
        );
      } else if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      // Extract and display the specific error message from Supabase
      const errorMessage = err.message || "Invalid email or password";
      console.error("Login error:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors duration-200"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 active:text-blue-700 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors duration-200"
              disabled={isLoading}
            />
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}
          <Button
            type="submit"
            className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800 active:bg-gray-900 active:scale-[0.98] transition-all duration-200 text-sm font-medium relative overflow-hidden"
            disabled={isLoading}
          >
            {isLoading && (
              <span className="absolute inset-0 flex items-center justify-center bg-black">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
            <span
              className={`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </span>
          </Button>

          <div className="text-sm text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline hover:text-blue-500 active:text-blue-700 transition-colors duration-200 font-medium"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
