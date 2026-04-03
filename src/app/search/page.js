"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "../context/CartContext";
import { Plus, SearchX } from "lucide-react";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (query) {
          const lowerQuery = query.toLowerCase();
          const filtered = data.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) || 
            p.category.toLowerCase().includes(lowerQuery)
          );
          setProducts(filtered);
        } else {
          setProducts(data);
        }
        setLoading(false);
      });
  }, [query]);

  return (
    <div style={{ padding: "1rem", maxWidth: "1400px", margin: "0 auto" }}>
      <h2 className="h2" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem", fontSize: "1.2rem" }}>
        Results for "{query}"
      </h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>Searching...</div>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="product-image-container" style={{ margin: 0, padding: '1rem' }}>
                  <img src={product.image || "https://via.placeholder.com/300?text=No+Image"} alt={product.name} className="product-image" />
                </div>
                <div style={{ padding: '0.5rem 0.5rem 0 0.5rem' }}>
                  <div className="product-title" style={{ fontSize: '0.9rem' }}>{product.name}</div>
                </div>
              </Link>
              <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
                <div className="product-price">
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹{product.price.toFixed(2)}</span>
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center', fontSize: '0.8rem' }} onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
          <SearchX size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
          <p>No products found for "{query}".</p>
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Try checking your spelling or use more general terms.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center" }}>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
