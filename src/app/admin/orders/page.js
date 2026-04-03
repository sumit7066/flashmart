"use client";
import React, { useState, useEffect } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrderDetails = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load orders", err);
        setLoading(false);
      });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`/api/orders?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h1 className="h1" style={{ fontSize: "2rem", marginBottom: "2rem" }}>Recent Orders</h1>
      
      <div className="card" style={{ padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.2)", textAlign: "left" }}>
              <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Order ID</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Customer</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Date</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Status</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Total</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No recent orders available.
                </td>
              </tr>
            ) : orders.map(order => (
              <React.Fragment key={order.id}>
                <tr style={{ borderBottom: expandedOrderId === order.id ? "none" : "1px solid var(--border)", cursor: "pointer" }} onClick={() => toggleOrderDetails(order.id)}>
                  <td style={{ padding: "1rem", fontWeight: "600" }}>{order.id.slice(0, 8)}...</td>
                  <td style={{ padding: "1rem" }}>{order.email}</td>
                  <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem" }} onClick={(e) => e.stopPropagation()}>
                    <select 
                      className="form-input" 
                      style={{ 
                        padding: '0.2rem 0.5rem', 
                        background: order.status === "Delivered" ? "rgba(34, 197, 94, 0.2)" : (order.status === "Shipped" ? "rgba(59, 130, 246, 0.2)" : "rgba(234, 179, 8, 0.2)"),
                        color: order.status === "Delivered" ? "#4ade80" : (order.status === "Shipped" ? "#60a5fa" : "#facc15"),
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Processing" style={{color: 'black'}}>Processing</option>
                      <option value="Shipped" style={{color: 'black'}}>Shipped</option>
                      <option value="Delivered" style={{color: 'black'}}>Delivered</option>
                    </select>
                  </td>
                  <td style={{ padding: "1rem" }}>₹{order.total.toFixed(2)}</td>
                  <td style={{ padding: "1rem" }}>
                    <button className="btn-outline" style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}>
                      {expandedOrderId === order.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
                {expandedOrderId === order.id && (
                  <tr style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid var(--border)" }}>
                    <td colSpan="6" style={{ padding: "1.5rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                        <div>
                          <h4 style={{ color: "var(--primary)", marginBottom: "1rem" }}>Shipping Details</h4>
                          <div style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
                            <p><strong>Name:</strong> {order.name}</p>
                            <p><strong>Phone:</strong> {order.phone}</p>
                            <p><strong>Address:</strong> {order.address}</p>
                            <p><strong>City:</strong> {order.city}</p>
                            <p><strong>Zip:</strong> {order.zip}</p>
                          </div>
                        </div>
                        <div>
                          <h4 style={{ color: "var(--primary)", marginBottom: "1rem" }}>Order Items</h4>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                            <thead>
                              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border-soft)" }}>
                                <th style={{ padding: "0.5rem 0" }}>Item</th>
                                <th style={{ padding: "0.5rem 0", textAlign: "center" }}>Qty</th>
                                <th style={{ padding: "0.5rem 0", textAlign: "right" }}>Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items?.map(item => (
                                <tr key={item.id}>
                                  <td style={{ padding: "0.5rem 0" }}>{item.name}</td>
                                  <td style={{ padding: "0.5rem 0", textAlign: "center" }}>{item.quantity}</td>
                                  <td style={{ padding: "0.5rem 0", textAlign: "right" }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
