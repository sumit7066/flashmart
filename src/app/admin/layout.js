"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut,
  ArrowLeft 
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <div className="admin-content" style={{ padding: 0 }}>{children}</div>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" style={{ paddingTop: "0" }}>
        <div style={{ padding: "2rem 1rem", borderBottom: "1px solid var(--border)", marginBottom: "1rem" }}>
          <h2 className="h2" style={{ margin: 0, fontSize: "1.5rem", background: "linear-gradient(to right, #ec4899, #9333ea)", WebkitBackgroundClip: "text", color: "transparent" }}>
            Admin Panel
          </h2>
        </div>
        
        <Link href="/admin" className={`admin-sidebar-item ${pathname === "/admin" ? "active" : ""}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link href="/admin/products" className={`admin-sidebar-item ${pathname === "/admin/products" ? "active" : ""}`}>
          <Package size={20} /> Products
        </Link>
        <Link href="/admin/orders" className={`admin-sidebar-item ${pathname === "/admin/orders" ? "active" : ""}`}>
          <ShoppingBag size={20} /> Orders
        </Link>
        <Link href="/admin/settings" className={`admin-sidebar-item ${pathname === "/admin/settings" ? "active" : ""}`}>
          <Settings size={20} /> Settings
        </Link>
        
        <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
           <button onClick={handleLogout} className="admin-sidebar-item" style={{ width: "100%", border: "none", background: "transparent", textAlign: "left", color: "#ef4444" }}>
             <LogOut size={20} /> Logout
           </button>
           <Link href="/" className="admin-sidebar-item" style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
             <ArrowLeft size={20} /> Back to Store
           </Link>
        </div>
      </aside>
      
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
