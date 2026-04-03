"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "./context/CartContext";
import { Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({
    bannerUrl: '/banner.png',
    globalTextColor: '#111111'
  });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
      
    // Fetch site settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.bannerUrl || data.globalTextColor) {
          setSettings({
            bannerUrl: data.bannerUrl || '/banner.png',
            globalTextColor: data.globalTextColor || '#111111'
          });
        }
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Dynamic Amazon-style Banner Section */}
      <section className="hero" style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
        <img 
          src={settings.bannerUrl} 
          alt="Flashmart Deals" 
          style={{ width: '100%', display: 'block', minHeight: '150px', objectFit: 'cover' }} 
        />
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '10%', 
          transform: 'translateY(-50%)',
          width: '80%'
        }}>
           <h1 style={{ 
             color: settings.globalTextColor, 
             fontSize: 'clamp(1.5rem, 5vw, 3rem)', 
             fontWeight: '800',
             textShadow: '0 2px 10px rgba(255,255,255,0.1)'
           }}>
             Shop Your Heart Out
           </h1>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '80px', background: 'linear-gradient(to top, #f3f3f3, transparent)' }}></div>
      </section>


      <div style={{ padding: "1rem", maxWidth: "1400px", margin: "0 auto" }}>

        <h2 className="h2" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
          Explore Products
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>Loading premium products...</div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-image-container" style={{ margin: 0, padding: '1rem' }}>
                    <img src={product.image} alt={product.name} className="product-image" />
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
        )}
      </div>
    </div>
  );
}