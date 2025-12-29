import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext.jsx";

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "300px", height: "300px", objectFit: "cover" }}
      />
      <div>
        <h2>{product.name}</h2>
        <p>£{product.price.toFixed(2)}</p>
        <p>{product.description}</p>
        <button onClick={() => addToCart(product, 1)}>Add to cart</button>
      </div>
    </div>
  );
};

export default ProductPage;
