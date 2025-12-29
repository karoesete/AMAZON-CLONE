import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const NavBar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <header
      style={{
        background: "#111827",
        color: "white",
        padding: "0.75rem 1rem",
        marginBottom: "1rem"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <h1>MiniAmazon</h1>
        </Link>

        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>
            Cart ({cartCount})
          </Link>
          {user ? (
            <>
              <span>Hello, {user.name}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ color: "white", textDecoration: "none" }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{ color: "white", textDecoration: "none" }}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
