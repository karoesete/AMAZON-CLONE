import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, total } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div>
        <h2>Your cart is empty</h2>
        <Link to="/">Go shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Your cart</h2>
      {cartItems.map((item) => (
        <div
          key={item._id}
          style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
        >
          <img
            src={item.image}
            alt={item.name}
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
          <div style={{ flex: 1 }}>
            <h3>{item.name}</h3>
            <p>£{item.price.toFixed(2)}</p>
            <input
              type="number"
              min="1"
              value={item.qty}
              onChange={(e) => updateQty(item._id, Number(e.target.value))}
              style={{ width: "60px" }}
            />
          </div>
          <button onClick={() => removeFromCart(item._id)}>Remove</button>
        </div>
      ))}
      <h3>Total: £{total.toFixed(2)}</h3>
      <button onClick={() => navigate("/checkout")}>Proceed to checkout</button>
    </div>
  );
};

export default CartPage;
