import React from "react";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, increase, decrease, removeFromCart, totalPrice, clearCart } =
    useCart();

  if (cart.length === 0)
    return <h3 className="text-center mt-5">Savat bo‘sh</h3>;

  return (
    <div className="container mt-5">
      <h2>Savat</h2>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Rasm</th>
            <th>Tur nomi</th>
            <th>Narx</th>
            <th>Soni</th>
            <th>Jami</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>
                <img
                  src={item.images?.[0]}
                  width="80"
                  height="60"
                  style={{ objectFit: "cover", borderRadius: "6px" }}
                />
              </td>

              <td>{item.title}</td>

              <td>{item.price} so'm</td>

              <td>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => decrease(item.id)}
                >
                  -
                </button>

                <span className="mx-2">{item.count}</span>

                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => increase(item.id)}
                >
                  +
                </button>
              </td>

              <td>{item.price * item.count} so'm</td>

              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  O‘chirish
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mt-4">Umumiy: {totalPrice} so'm</h3>

      <button className="btn btn-warning mt-3" onClick={clearCart}>
        Savatni tozalash
      </button>
    </div>
  );
}
