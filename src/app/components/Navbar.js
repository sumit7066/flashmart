"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, User, Menu, X, Search, MapPin, Home, Package, Smartphone } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => {
      if (data.user) setUser(data.user);
    });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'POST' });
    setUser(null);
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  // Don't show regular navbar on admin routes
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <nav className="navbar">
        {/* Top Row: Logo, Search (Desktop), Actions */}
        <div className="nav-top-row">
          <div className="nav-left-section">
            {/* Removed top-left Menu button as requested */}
            <Link href="/" className="logo">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/logo.png" alt="Flashmart Logo" style={{ height: '32px', width: 'auto' }} />
                <span style={{ fontSize: "1.5rem", color: 'white', fontWeight: 'bold' }}>Flashmart</span>
              </div>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="search-container desktop-only" style={{ flex: 1, margin: '0 2rem', maxWidth: '800px' }}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search Flashmart" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-icon-btn">
              <Search size={20} color="#333" />
            </button>
          </form>
          
          <div className="nav-actions">
            <div className="desktop-only" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {user ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link href="/orders" className="nav-link-block">
                    <span className="nav-line-1">Returns</span>
                    <span className="nav-line-2">& Orders</span>
                  </Link>
                  <button onClick={handleLogout} className="nav-link-block" style={{ background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
                    <span className="nav-line-1">Hello, {user.name?.split(' ')[0]}</span>
                    <span className="nav-line-2">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="nav-link-block">
                  <span className="nav-line-1">Hello, sign in</span>
                  <span className="nav-line-2">Account & Lists</span>
                </Link>
              )}
            </div>
            <Link href="/cart" className="cart-link">
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={32} />
                <span className="cart-count">{totalItems}</span>
              </div>
              <span className="desktop-only nav-line-2" style={{ alignSelf: 'flex-end', marginBottom: '4px' }}>Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar (Only visible on mobile) */}
        <form onSubmit={handleSearch} className="search-container mobile-only" style={{ marginTop: '0.5rem' }}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search Flashmart" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-icon-btn">
            <Search size={20} color="#333" />
          </button>
        </form>

        {/* Removed Location/Category Ribbon as requested */}
      </nav>

      {/* Fixed Bottom Navigation for Mobile */}
      <div className="bottom-nav">
        <Link href="/" className={`bottom-nav-item ${pathname === '/' ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </Link>
        <Link href="/login" className={`bottom-nav-item ${pathname === '/login' ? 'active' : ''}`}>
          <User size={24} />
          <span>You</span>
        </Link>
        <Link href="/orders" className={`bottom-nav-item ${pathname === '/orders' ? 'active' : ''}`}>
          <Package size={24} />
          <span>Orders</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(true)} className="bottom-nav-item" style={{ background: 'transparent', border: 'none' }}>
          <Menu size={24} />
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'white' }}>Browse Flashmart</h2>
          <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white' }}>
            <X size={28} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Link href="/" className="mobile-link">Home</Link>
          <Link href="/clothes" className="mobile-link">Shop by Category: Clothes</Link>
          <Link href="/cosmetics" className="mobile-link">Shop by Category: Cosmetics</Link>
          <Link href="/grocery" className="mobile-link">Shop by Category: Grocery</Link>
          
          <div style={{ borderTop: "1px solid #333", margin: "1rem 0" }}></div>
          
          {user ? (
            <>
              <Link href="/orders" className="mobile-link">Returns & Orders</Link>
              <button onClick={handleLogout} className="mobile-link text-left" style={{ background: "transparent", border: "none", color: "var(--primary)" }}>Sign Out</button>
            </>
          ) : (
            <Link href="/login" className="mobile-link">Sign In</Link>
          )}
        </div>
      </div>
    </>
  );
}
