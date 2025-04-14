import { motion } from "framer-motion";
import CheckoutSummary from "../checkout/CheckoutSummary";

export default function CheckoutPage() {
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
            Checkout
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Review your selected services and proceed to booking
          </p>
        </div>

        <CheckoutSummary />
      </motion.div>
    </div>
  );
}
