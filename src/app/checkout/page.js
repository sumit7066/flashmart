"use client";
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxes = total * 0.1; // 10% tax
  const finalTotal = total + taxes;

  const handleInput = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          total: finalTotal,
          items: cart
        }),
      });

      if (response.ok) {
        setSuccess(true);
        clearCart();
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order.');
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
        <CheckCircle2 size={80} color="#4ade80" style={{ margin: '0 auto 2rem auto' }} />
        <h1 className="h1" style={{ fontSize: '2.5rem' }}>Order Confirmed!</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "1.1rem" }}>
          Thank you for your purchase, {formData.name}. Your order will be shipped to {formData.address}.
        </p>
        <Link href="/">
          <button className="btn-primary">Return to Store</button>
        </Link>
      </div>
    );
  }

  if (cart.length === 0 && !success) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h2 className="h2">Your Cart is Empty</h2>
        <Link href="/">
          <button className="btn-primary" style={{ marginTop: '1rem' }}>Start Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 className="h1" style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Secure Checkout</h1>
      
      <div className="split-layout">
        <div className="card">
          <h2 className="h2" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Customer Details</h2>
          <form id="checkout-form" onSubmit={handleCheckout}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleInput} />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleInput} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Phone Number</label>
                <input type="tel" name="phone" className="form-input" required value={formData.phone} onChange={handleInput} />
              </div>
            </div>
            
            <h2 className="h2" style={{ fontSize: "1.5rem", margin: "2rem 0 1.5rem 0" }}>Shipping Address</h2>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input type="text" name="address" className="form-input" required value={formData.address} onChange={handleInput} />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">City</label>
                <input type="text" name="city" className="form-input" required value={formData.city} onChange={handleInput} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Postal Code</label>
                <input type="text" name="zip" className="form-input" required value={formData.zip} onChange={handleInput} />
              </div>
            </div>
          </form>
        </div>

        <div className="card" style={{ height: "fit-content", position: "sticky", top: "100px" }}>
          <h2 className="h2" style={{ fontSize: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>Order Summary</h2>
          
          <div style={{ maxHeight: "200px", overflowY: "auto", margin: "1rem 0" }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "0.5rem 0" }}>
              <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "0.5rem 0" }}>
              <span style={{ color: "var(--text-muted)" }}>Estimated Tax (10%)</span>
              <span>₹{taxes.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "1.5rem 0", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", fontWeight: "700", fontSize: "1.5rem" }}>
              <span>Total</span>
              <span style={{ color: "var(--primary-hover)" }}>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <button type="submit" form="checkout-form" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "1rem" }}>
            Place Order (₹{finalTotal.toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
}
