"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Plus, Tag } from "lucide-react";
import { use } from 'react'; // for unwrap params
import Link from 'next/link';

export default function CategoryPage({ params }) {
  // unwrap params using React.use for Next.js 15+ (if Next.js 14, standard destructuring works, but wrapping handles both)
  let resolvedParams = null;
  try {
    resolvedParams = use(params);
  } catch(e) {
    resolvedParams = params;
  }
  
  const category = resolvedParams?.category;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products?category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        // If data might be an error or not found, fall back to empty array
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      });
  }, [category]);

  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : "";

  return (
    <div style={{ padding: "1rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
        <h1 className="h2" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {categoryName} <Tag size={24} color="var(--primary)" />
        </h1>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>Refining premium selections...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          No products found in this category.
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="product-image-container" style={{ margin: 0, padding: '1rem' }}>
                  <img src={product.image || "https://via.placeholder.com/300?text=No+Image"} alt={product.name} className="product-image" />
                </div>
                <div style={{ padding: '0.5rem 0.5rem 0 0.5rem' }}>
                  <div className="product-category" style={{ fontSize: '0.7rem' }}>{product.category}</div>
                  <div className="product-title" style={{ fontSize: '0.9rem' }}>{product.name}</div>
                </div>
              </Link>
              <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
                <div className="product-price">
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹{product.price.toFixed(2)}</span>
                </div>
                <button
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center', fontSize: '0.8rem' }}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
