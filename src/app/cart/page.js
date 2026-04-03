"use client";
import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxes = total * 0.1; // 10% tax
  const finalTotal = total + taxes;

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <ShoppingBag size={64} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem auto' }} />
        <h2 className="h2">Your Cart is Empty</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Looks like you haven't added anything to your cart yet.</p>
        <Link href="/">
          <button className="btn-primary">Start Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 className="h1" style={{ fontSize: "2.5rem" }}>Shopping Cart</h1>
      <div className="split-layout">
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {cart.map(item => (
            <div key={item.id} className="card cart-item-flex">
              <div style={{ width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden", margin: "0 auto" }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="product-category">{item.category}</div>
                <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>{item.name}</div>
                <div style={{ color: "var(--text-muted)" }}>Qty: {item.quantity} × ₹{item.price.toFixed(2)}</div>
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: "700" }}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", padding: "0.75rem", borderRadius: "8px", cursor: "pointer" }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <div style={{ textAlign: "right" }}>
            <button className="btn-outline" onClick={clearCart}>Clear All</button>
          </div>
        </div>

        <div className="card" style={{ height: "fit-content", position: "sticky", top: "100px" }}>
          <h2 className="h2" style={{ fontSize: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>Order Summary</h2>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem 0" }}>
            <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem 0" }}>
            <span style={{ color: "var(--text-muted)" }}>Estimated Tax</span>
            <span>₹{taxes.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "1.5rem 0", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", fontWeight: "700", fontSize: "1.5rem" }}>
            <span>Total</span>
            <span style={{ color: "var(--primary-hover)" }}>₹{finalTotal.toFixed(2)}</span>
          </div>
          <Link href="/checkout" style={{ display: "block", width: "100%" }}>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "1rem" }}>
              Proceed to Checkout
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
