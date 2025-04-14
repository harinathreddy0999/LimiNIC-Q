import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ServicesList from "../services/ServicesList";
import ServiceCategoryView from "../services/ServiceCategoryView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

export default function ServicesPage() {
  const location = useLocation();
  const params = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("haircare");

  // Extract category from URL params or query params
  useEffect(() => {
    // First check URL params (from route)
    if (params.category) {
      setActiveCategory(params.category.toLowerCase());
      return;
    }

    // Then check query params
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");
    if (category) {
      setActiveCategory(category.toLowerCase());
      toast({
        title: `${category} Services`,
        description: `Browsing our ${category.toLowerCase()} services`,
      });
    }
  }, [location.search, params.category, toast]);

  const handleTabChange = (value: string) => {
    setActiveCategory(value);
    navigate(`/services/${value}`, { replace: true });
    toast({
      title: `${value.charAt(0).toUpperCase() + value.slice(1)} Services`,
      description: `Browsing our ${value.toLowerCase()} services`,
    });
  };

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
            Our Services
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Discover our premium salon and spa services designed to enhance your
            natural beauty and promote wellness
          </p>
        </div>

        <Tabs
          defaultValue={activeCategory}
          value={activeCategory}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex justify-center mb-12">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-gray-100 rounded-full p-1">
              <TabsTrigger
                value="haircare"
                className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white transition-all duration-300"
              >
                Haircare
              </TabsTrigger>
              <TabsTrigger
                value="skincare"
                className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white transition-all duration-300"
              >
                Skincare
              </TabsTrigger>
              <TabsTrigger
                value="massage"
                className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white transition-all duration-300"
              >
                Massage
              </TabsTrigger>
              <TabsTrigger
                value="wellness"
                className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white transition-all duration-300"
              >
                Wellness
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="haircare">
            <ServiceCategoryView />
          </TabsContent>

          <TabsContent value="skincare">
            <ServiceCategoryView />
          </TabsContent>

          <TabsContent value="massage">
            <ServiceCategoryView />
          </TabsContent>

          <TabsContent value="wellness">
            <ServiceCategoryView />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
