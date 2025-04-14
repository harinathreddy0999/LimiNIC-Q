import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
  children?: React.ReactNode;
}

export default function CartDrawer({ children }: CartDrawerProps) {
  const { items, removeItem, totalPrice, totalDuration } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleCheckout = () => {
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full"
          >
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-blue-500"
                variant="default"
              >
                {items.length}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Your cart is empty"
              : `You have ${items.length} service${items.length !== 1 ? "s" : ""} in your cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <AnimatePresence>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <Button
                  onClick={() => {
                    setOpen(false);
                    navigate("/services");
                  }}
                  className="mt-4 rounded-full"
                >
                  Browse Services
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-between items-center p-3 border border-gray-100 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{item.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{item.price}</span>
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
              </div>
            )}
          </AnimatePresence>
        </div>

        {items.length > 0 && (
          <SheetFooter>
            <Button
              onClick={handleCheckout}
              className="w-full rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
