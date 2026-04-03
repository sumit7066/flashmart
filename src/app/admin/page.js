"use client";
import React, { useEffect, useState } from "react";
import { Copy, Users, Package, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProductCount(data.length));
      
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        const revenue = data
          .filter(order => order.status === "Delivered")
          .reduce((sum, order) => sum + order.total, 0);
        setTotalRevenue(revenue);
        
        // Count unique emails as customers
        const uniqueCustomers = new Set(data.map(o => o.email));
        setCustomerCount(uniqueCustomers.size);
      });
  }, []);

  return (
    <div>
      <h1 className="h1" style={{ fontSize: "2rem", marginBottom: "2rem" }}>Dashboard Overview</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ background: "rgba(147, 51, 234, 0.2)", padding: "1rem", borderRadius: "12px", color: "#d8b4fe" }}>
            <DollarSign size={28} />
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Total Revenue</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "700" }}>₹{totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ background: "rgba(236, 72, 153, 0.2)", padding: "1rem", borderRadius: "12px", color: "#f9a8d4" }}>
            <Package size={28} />
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Active Products</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "700" }}>{productCount}</div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ background: "rgba(59, 130, 246, 0.2)", padding: "1rem", borderRadius: "12px", color: "#93c5fd" }}>
            <Users size={28} />
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Total Customers</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "700" }}>{customerCount}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <h2 className="h2" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Recent Activity</h2>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
            <span>Order #4092 created</span>
            <span style={{ color: "var(--text-muted)" }}>2 mins ago</span>
          </div>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
            <span>New user registered: alex@example.com</span>
            <span style={{ color: "var(--text-muted)" }}>1 hour ago</span>
          </div>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
            <span>Product "Silk Wrap Dress" updated</span>
            <span style={{ color: "var(--text-muted)" }}>3 hours ago</span>
          </div>
          <div style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between" }}>
            <span>Order #4091 fulfilled</span>
            <span style={{ color: "var(--text-muted)" }}>1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
