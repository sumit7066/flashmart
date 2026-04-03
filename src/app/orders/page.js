"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders/my-orders')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Unauthorized');
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text)' }}>Loading orders...</div>;

  return (
    <div className="section" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="section-title">My Orders</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Package size={48} style={{ color: 'var(--text-muted)', margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
          <Link href="/" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Start Shopping</Link>
        </div>
      ) : (
        <div className="grid">
          {orders.map(order => (
            <div key={order.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Order #{order.id.slice(0, 8)}</span>
                <span className="badge" style={{
                  background: order.status === "Delivered" ? "rgba(34, 197, 94, 0.2)" : (order.status === "Shipped" ? "rgba(59, 130, 246, 0.2)" : "rgba(234, 179, 8, 0.2)"),
                  color: order.status === "Delivered" ? "#4ade80" : (order.status === "Shipped" ? "#60a5fa" : "#facc15")
                }}>
                  {order.status}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', color: 'var(--text)' }}>Items:</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {order.items?.map(item => (
                    <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--text)' }}>
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
