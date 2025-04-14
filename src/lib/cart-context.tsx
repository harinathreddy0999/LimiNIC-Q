import { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
  id?: string;
  title: string;
  price: string;
  duration: string;
  category?: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  totalPrice: string;
  totalDuration: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  const removeItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculate total price
  const totalPrice = items
    .reduce((total, item) => {
      const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ""));
      return isNaN(priceValue) ? total : total + priceValue;
    }, 0)
    .toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  // Calculate total duration in minutes
  const totalDuration =
    items
      .reduce((total, item) => {
        const durationMatch = item.duration.match(/\d+/);
        const durationValue = durationMatch ? parseInt(durationMatch[0]) : 0;
        return total + durationValue;
      }, 0)
      .toString() + " min";

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        totalPrice,
        totalDuration,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
