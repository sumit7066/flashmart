"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { ArrowLeft, CheckCircle, Share2, ShieldQuestion } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000); // 2 second success reset
    }
  };

  if (loading) return <div style={{ padding: "4rem", textAlign: "center" }}>Loading product...</div>;
  if (!product || product.error) return <div style={{ padding: "4rem", textAlign: "center" }}>Product not found.</div>;

  return (
    <div style={{ paddingBottom: '80px', backgroundColor: '#fff' }}>
      {/* Top Mobile Application Action Bar */}
      <div style={{ position: 'sticky', top: '70px', zIndex: 10, display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'transparent' }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
        >
          <ArrowLeft size={24} color="#333" />
        </button>
        <button 
          style={{ background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
        >
          <Share2 size={24} color="#333" />
        </button>
      </div>

      {/* Hero Product Image */}
      <div style={{ width: '100%', aspectRatio: '1', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-50px', padding: '2rem' }}>
        <img src={product.image || "https://via.placeholder.com/600?text=No+Image"} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>

      {/* Product Information Container */}
      <div style={{ padding: '1rem', borderTop: '1px solid #eee' }}>
        {/* Category Badge */}
        <span style={{ color: 'var(--primary-hover)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {product.category || 'Category'}
        </span>
        
        {/* Title */}
        <h1 style={{ fontSize: '1.25rem', fontWeight: '500', marginTop: '0.3rem', lineHeight: '1.3', color: '#111' }}>
          {product.name}
        </h1>

        {/* Pricing */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '1rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: '700', color: '#111' }}>
            <span style={{ fontSize: '1.2rem', verticalAlign: 'top', marginTop: '5px', display: 'inline-block' }}>₹</span>
            {Math.floor(product.price)}
            <span style={{ fontSize: '1.2rem', verticalAlign: 'top', marginTop: '5px', display: 'inline-block' }}>{(product.price % 1).toFixed(2).substring(1)}</span>
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-5px' }}>Inclusive of all taxes</p>

        {/* Trust/Policy Ticker */}
        <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0', padding: '1rem 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', margin: '0 auto', background: '#f5f5f5', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ShieldQuestion size={20} color="#555" /></div>
            <p style={{ fontSize: '0.7rem', color: '#007185', marginTop: '0.5rem', lineHeight: '1.2' }}>Cash on<br/>Delivery</p>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', margin: '0 auto', background: '#f5f5f5', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><img src="https://img.icons8.com/color/48/000000/return-purchase.png" alt="Return" style={{width: 20}} /></div>
            <p style={{ fontSize: '0.7rem', color: '#007185', marginTop: '0.5rem', lineHeight: '1.2' }}>7 Days<br/>Replacement</p>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', margin: '0 auto', background: '#f5f5f5', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><img src="https://img.icons8.com/color/48/000000/delivery--v1.png" alt="Delivery" style={{width: 20}} /></div>
            <p style={{ fontSize: '0.7rem', color: '#007185', marginTop: '0.5rem', lineHeight: '1.2' }}>Flashmart<br/>Delivered</p>
          </div>
        </div>

        {/* Stock Status */}
        <div style={{ marginTop: '0.5rem' }}>
          {product.stock > 0 ? (
            <span style={{ color: '#007600', fontWeight: 'bold', fontSize: '1.1rem' }}>In stock</span>
          ) : (
            <span style={{ color: '#B12704', fontWeight: 'bold', fontSize: '1.1rem' }}>Currently unavailable.</span>
          )}
        </div>

        {/* Add to Cart Container */}
        {product.stock > 0 && (
          <div style={{ padding: '1rem 0', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <div style={{ width: '100%' }}>
              <button 
                onClick={handleAddToCart}
                style={{
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '999px', 
                  background: added ? '#22c55e' : 'var(--primary)', 
                  color: added ? '#fff' : '#111', 
                  border: 'none', 
                  fontSize: '1rem', 
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                {added ? <><CheckCircle size={20} /> Added to Cart</> : 'Add to Cart'}
              </button>
            </div>
          </div>
        )}

        {/* Description & Details */}
        <div style={{ margin: '1.5rem 0 2rem 0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111' }}>Product Description</h3>
          <p style={{ fontSize: '0.9rem', color: '#333', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {product.description || 'Premium quality product. Detailed description coming soon.'}
          </p>

          {product.details && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111' }}>Technical Details</h3>
              <p style={{ fontSize: '0.85rem', color: '#444', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {product.details}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
