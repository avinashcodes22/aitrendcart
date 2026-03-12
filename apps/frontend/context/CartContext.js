import { createContext, useContext, useEffect, useState } from "react";
import { cartApi } from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setCart({ items: [] });
      setLoading(false);
      return;
    }

    cartApi
      .getCart(token)
      .then((data) => {
        setCart(data || { items: [] });
        setLoading(false);
      })
      .catch(() => {
        setCart({ items: [] });
        setLoading(false);
      });
  }, [token]);

  return (
    <CartContext.Provider value={{ cart, setCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
