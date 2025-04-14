import React, { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import DashboardGrid from "../dashboard/DashboardGrid";
import TaskBoard from "../dashboard/TaskBoard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useAuth } from "../../../supabase/auth";
import { Navigate } from "react-router-dom";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Function to trigger loading state for demonstration
  const handleRefresh = () => {
    setLoading(true);
    toast({
      title: "Refreshing dashboard",
      description: "Fetching the latest data...",
      duration: 2000,
    });

    // Simulate API call to refresh dashboard data
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Dashboard refreshed",
        description: "All data is now up to date",
        duration: 3000,
      });
    }, 2000);
  };
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 pt-4 pb-2 flex justify-end">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleRefresh}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""} transition-transform duration-300`}
                />
                <span className="transition-opacity duration-200">
                  {loading ? "Refreshing..." : "Refresh Dashboard"}
                </span>
              </Button>
            </motion.div>
          </div>
          <div
            className={cn(
              "container mx-auto p-6 space-y-8",
              "transition-all duration-300 ease-in-out",
            )}
          >
            <DashboardGrid isLoading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
