import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api";

const CheckoutPage = () => {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [error, setError] = useState("");

  if (!user) {
    return <p>You must be logged in to checkout.</p>;
  }

  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  const handleChange = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const itemsPrice = total;
      const shippingPrice = total > 50 ? 0 : 4.99;
      const taxPrice = Number((0.2 * itemsPrice).toFixed(2));
      const totalPrice = itemsPrice + shippingPrice + taxPrice;

      await api.post("/orders", {
        orderItems: cartItems.map((i) => ({
          product: i._id,
          name: i.name,
          qty: i.qty,
          price: i.price,
          image: i.image
        })),
        shippingAddress: shipping,
        paymentMethod: "card",
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      });

      clearCart();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Checkout</h2>
      <p>Order total (items): £{total.toFixed(2)}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {["fullName", "address", "city", "postalCode", "country"].map((f) => (
          <div key={f}>
            <label>{f}</label>
            <input name={f} value={shipping[f]} onChange={handleChange} />
          </div>
        ))}
        <button type="submit">Place order</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
