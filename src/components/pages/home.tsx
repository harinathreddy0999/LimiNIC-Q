import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/cart/CartDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  MessageCircle,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AIAssistant } from "@/components/AIAssistant";
import { AIRecommendationEngine } from "@/components/ai/AIRecommendationEngine";
import { Input } from "@/components/ui/input";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiRecommendationOpen, setAiRecommendationOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    navigate(`/services?search=${encodeURIComponent(searchValue)}`);
    toast({
      title: "Searching Services",
      description: `Showing results for "${searchValue}"`,
    });
  };

  const serviceCategories = [
    {
      title: "Haircare",
      description:
        "Expert styling, coloring, and treatments for all hair types",
      icon: "✂️",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Skincare",
      description: "Facials, peels, and treatments for radiant, healthy skin",
      icon: "✨",
      bgColor: "bg-rose-50",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      title: "Massage",
      description: "Therapeutic and relaxing massages for body and mind",
      icon: "👐",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Wellness",
      description: "Holistic treatments to restore balance and vitality",
      icon: "🧘",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="max-w-[1200px] mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-medium text-2xl">
              LumiNIC-Q
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-7 text-sm font-light">
            <Link
              to="/services?category=haircare"
              className="hover:text-gray-500 transition-colors duration-200"
            >
              Haircare
            </Link>
            <Link
              to="/services?category=skincare"
              className="hover:text-gray-500 transition-colors duration-200"
            >
              Skincare
            </Link>
            <Link
              to="/services?category=massage"
              className="hover:text-gray-500 transition-colors duration-200"
            >
              Massage
            </Link>
            <Link
              to="/services?category=wellness"
              className="hover:text-gray-500 transition-colors duration-200"
            >
              Wellness
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Dashboard
                  </Button>
                </Link>
                <CartDrawer />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-black text-white hover:bg-gray-800 text-sm px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="py-20 px-4 text-center bg-gradient-to-b from-purple-50 to-white"
        >
          <h2 className="text-5xl font-semibold tracking-tight mb-2">
            LumiNIC-Q
          </h2>
          <h3 className="text-2xl font-medium text-gray-600 mb-6">
            Premium Salon & Spa Experience
          </h3>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-8">
            Discover a sanctuary of beauty and wellness where expert care meets
            luxurious treatments. Your journey to rejuvenation begins here.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for services..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-12 pl-4 pr-12 rounded-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 rounded-full"
                disabled={!searchValue.trim()}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button
              className="rounded-full bg-black text-white hover:bg-gray-800 text-base px-8 py-6 w-full sm:w-auto transition-all duration-300 transform hover:scale-105 active:scale-95"
              onClick={() => {
                setIsBookingLoading(true);
                // Simulate API call
                setTimeout(() => {
                  setIsBookingLoading(false);
                  navigate("/signup");
                  toast({
                    title: "Booking initiated",
                    description: "Please create an account to continue booking",
                  });
                }, 800);
              }}
              disabled={isBookingLoading}
            >
              {isBookingLoading ? (
                <>
                  <LoadingSpinner className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Book Now"
              )}
            </Button>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                className="rounded-full border-2 border-black text-black hover:bg-black hover:text-white text-base px-8 py-6 w-full sm:w-auto transition-all duration-300 transform hover:scale-105 active:scale-95"
                onClick={() => {
                  setIsAssistantLoading(true);
                  // Short delay to show loading state
                  setTimeout(() => {
                    setIsAssistantLoading(false);
                    setAiAssistantOpen(true);
                  }, 400);
                }}
                disabled={isAssistantLoading}
              >
                {isAssistantLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-5 w-5" /> AI Assistant
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white text-base px-8 py-6 w-full sm:w-auto transition-all duration-300 transform hover:scale-105 active:scale-95"
                onClick={() => setAiRecommendationOpen(true)}
              >
                <Sparkles className="mr-2 h-5 w-5" /> AI Recommendations
              </Button>
            </div>
          </div>
          <motion.div
            className="relative mt-12 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1200&q=80"
              alt="Luxury salon interior"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </motion.section>

        {/* Service Categories */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-20 px-4 bg-white"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold tracking-tight mb-4">
                Our Premium Services
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Indulge in our carefully curated selection of premium treatments
                and services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {serviceCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  variants={fadeIn}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`${category.bgColor} rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300`}
                >
                  <div
                    className={`${category.iconBg} h-16 w-16 rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <h3 className="text-2xl font-medium mb-3">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{category.description}</p>
                  <Link
                    to={`/services?category=${category.title.toLowerCase()}`}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                      className="flex items-center text-black font-medium"
                    >
                      Explore {category.title}{" "}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Featured Services */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold tracking-tight mb-4">
                Featured Experiences
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Our most popular and sought-after treatments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <img
                  src="https://images.unsplash.com/photo-1595867818082-083862f3d630?w=600&q=80"
                  alt="Signature facial treatment"
                  className="w-full h-64 object-cover"
                />
                <div className="p-8">
                  <h3 className="text-2xl font-medium mb-2">
                    Signature Facial
                  </h3>
                  <p className="text-gray-600 mb-4">
                    A personalized facial treatment that addresses your specific
                    skin concerns.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">$120</span>
                    <Button
                      variant="outline"
                      className="rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-black hover:text-white"
                      onClick={() => {
                        navigate("/signup");
                        toast({
                          title: "Booking initiated",
                          description:
                            "Please create an account to book our Signature Facial",
                        });
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <img
                  src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80"
                  alt="Deep tissue massage"
                  className="w-full h-64 object-cover"
                />
                <div className="p-8">
                  <h3 className="text-2xl font-medium mb-2">
                    Deep Tissue Massage
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Relieve chronic muscle tension with our therapeutic deep
                    tissue massage.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">$150</span>
                    <Button
                      variant="outline"
                      className="rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-black hover:text-white"
                      onClick={() => {
                        navigate("/signup");
                        toast({
                          title: "Booking initiated",
                          description:
                            "Please create an account to book our Deep Tissue Massage",
                        });
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <img
                  src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80"
                  alt="Hair styling and coloring"
                  className="w-full h-64 object-cover"
                />
                <div className="p-8">
                  <h3 className="text-2xl font-medium mb-2">
                    Premium Hair Styling
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete hair transformation with expert cutting, coloring,
                    and styling.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">$180+</span>
                    <Button
                      variant="outline"
                      className="rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-black hover:text-white"
                      onClick={() => {
                        navigate("/signup");
                        toast({
                          title: "Booking initiated",
                          description:
                            "Please create an account to book our Premium Hair Styling",
                        });
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold tracking-tight mb-4">
                Client Experiences
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                What our clients say about their LumiNIC-Q experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-purple-50 rounded-3xl p-8">
                <div className="flex items-center mb-6">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
                      alt="Emily"
                    />
                    <AvatarFallback>EM</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Emily Johnson</h4>
                    <p className="text-sm text-gray-500">Skincare Client</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "The facial treatment was exactly what my skin needed. The
                  therapist was knowledgeable and the ambiance was so relaxing.
                  I've already booked my next appointment!"
                </p>
              </div>

              <div className="bg-blue-50 rounded-3xl p-8">
                <div className="flex items-center mb-6">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
                      alt="Michael"
                    />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Michael Rodriguez</h4>
                    <p className="text-sm text-gray-500">Massage Client</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "The deep tissue massage was incredible. I came in with severe
                  back pain and left feeling like a new person. The therapist
                  really listened to my concerns."
                </p>
              </div>

              <div className="bg-amber-50 rounded-3xl p-8">
                <div className="flex items-center mb-6">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia"
                      alt="Sophia"
                    />
                    <AvatarFallback>SL</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Sophia Lee</h4>
                    <p className="text-sm text-gray-500">Hair Client</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "I've never received so many compliments on my hair! The
                  stylist really understood what I wanted and delivered beyond
                  my expectations. Worth every penny."
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="border-b border-gray-200 pb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium text-black mb-4">LumiNIC-Q</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-black mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/services?category=haircare"
                    className="hover:underline"
                  >
                    Haircare
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services?category=skincare"
                    className="hover:underline"
                  >
                    Skincare
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services?category=massage"
                    className="hover:underline"
                  >
                    Massage
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services?category=wellness"
                    className="hover:underline"
                  >
                    Wellness
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-black mb-4">Information</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Gift Cards
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Locations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-black mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-4 flex flex-col md:flex-row md:justify-between items-center">
            <p>© 2024 LumiNIC-Q Premium Salon & Spa. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/" className="hover:text-black">
                Instagram
              </Link>
              <Link to="/" className="hover:text-black">
                Facebook
              </Link>
              <Link to="/" className="hover:text-black">
                Twitter
              </Link>
              <Link to="/" className="hover:text-black">
                Pinterest
              </Link>
            </div>
          </div>
        </div>
      </footer>
      {/* AI Dialogs */}
      <AIAssistant open={aiAssistantOpen} onOpenChange={setAiAssistantOpen} />
      <AIRecommendationEngine
        open={aiRecommendationOpen}
        onOpenChange={setAiRecommendationOpen}
      />
    </div>
  );
}
