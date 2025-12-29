import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem"
        }}
      >
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "0.5rem"
            }}
          >
            <Link to={`/product/${p._id}`}>
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", height: "160px", objectFit: "cover" }}
              />
              <h3>{p.name}</h3>
            </Link>
            <p>£{p.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
