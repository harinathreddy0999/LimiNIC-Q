import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import ServiceCard from "./ServiceCard";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  category: string;
  ai_tag?: string;
}

export default function ServiceCategoryView() {
  const { category } = useParams<{ category: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from("services").select("*");

        if (category && category !== "all") {
          query = query.eq("category", category.toLowerCase());
        }

        const { data, error } = await query.order("title");

        if (error) throw error;

        console.log("Services data:", data);

        if (data && data.length > 0) {
          setServices(data);
        } else {
          // Fallback to static data if no services are found
          setServices([
            {
              id: "1",
              title: "Precision Haircut",
              description:
                "Expert haircut tailored to your face shape, hair texture, and personal style.",
              price: "$75+",
              duration: "45 min",
              image:
                "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
              category: "haircare",
              ai_tag: "Recommended for fine hair",
            },
            {
              id: "2",
              title: "Hydrating Facial",
              description:
                "Intensive moisture treatment for dry, dehydrated skin using hyaluronic acid and botanicals.",
              price: "$135+",
              duration: "60 min",
              image:
                "https://images.unsplash.com/photo-1596178060810-72660ee8a9d1?w=800&q=80",
              category: "skincare",
              ai_tag: "Perfect for dry skin",
            },
            {
              id: "3",
              title: "Deep Tissue Massage",
              description:
                "Therapeutic massage targeting deeper muscle layers to release chronic tension and pain.",
              price: "$150+",
              duration: "60 min",
              image:
                "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
              category: "massage",
              ai_tag: "Pain relief specialist",
            },
          ]);
        }
      } catch (err: any) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category, toast]);

  // Removed the redirect effect as we now have fallback data

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner className="h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Error Loading Services
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="rounded-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold tracking-tight mb-4">
            {category
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Services`
              : "All Services"}
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Explore our premium {category?.toLowerCase() || "salon and spa"}{" "}
            services designed for your ultimate relaxation and rejuvenation
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <ServiceCard
                title={service.title}
                description={service.description}
                price={service.price}
                duration={service.duration}
                image={service.image}
                aiTag={service.ai_tag}
                category={service.category}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
