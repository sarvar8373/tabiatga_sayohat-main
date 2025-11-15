import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (tour) => {
    const exists = cart.find((item) => item.id === tour.id);

    if (exists) {
      if (exists.count >= tour.max_booking) {
        return "max"; // cheklov
      }
      exists.count++;
      setCart([...cart]);
      return "added";
    }

    setCart([...cart, { ...tour, count: 1 }]);
    return "added";
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const increase = (id) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.count < item.max_booking) {
            return { ...item, count: item.count + 1 };
          }
        }
        return item;
      })
    );
  };

  const decrease = (id) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            if (item.count > 1) {
              return { ...item, count: item.count - 1 };
            }
          }
          return item;
        })
        .filter((item) => item.count > 0)
    );
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increase,
        decrease,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
