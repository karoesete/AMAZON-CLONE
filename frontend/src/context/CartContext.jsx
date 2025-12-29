import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i._id === product._id);
      if (exists) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i._id !== id));
  };

  const updateQty = (id, qty) => {
    setCartItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
