"use client";
import React, { useEffect, useState } from "react";
import { Plus, Trash, Edit, RefreshCw } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: 10,
    category: "clothes",
    image: "",
    description: "",
    details: ""
  });

  const fetchProducts = () => {
    setLoading(true);
    fetch(`/api/products?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) return;
    
    if (editingId) {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          id: editingId,
          price: parseFloat(newProduct.price)
        })
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price)
        })
      });
    }
    
    setAdding(false);
    setEditingId(null);
    setNewProduct({ name: "", price: "", stock: 10, category: "clothes", image: "", description: "", details: "" });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      price: product.price,
      stock: product.stock || 0,
      category: product.category,
      image: product.image,
      description: product.description || "",
      details: product.details || ""
    });
    setEditingId(product.id);
    setAdding(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setNewProduct({...newProduct, image: data.url});
      }
    } catch (err) {
      console.error('File upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="h1" style={{ fontSize: "2rem", margin: 0 }}>Manage Products</h1>
        <button className="btn-primary" onClick={() => {
            setEditingId(null);
            setNewProduct({ name: "", price: "", stock: 10, category: "clothes", image: "", description: "", details: "" });
            setAdding(!adding);
        }}>
          <Plus size={18} /> Add New
        </button>
      </div>

      {adding && (
        <div className="card" style={{ marginBottom: "2rem", border: "1px solid var(--primary-glow)" }}>
          <h2 className="h2" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>{editingId ? "Edit Product" : "Create Product"}</h2>
          <form onSubmit={handleSave} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label className="form-label">Name</label>
              <input type="text" className="form-input" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            </div>
            <div style={{ flex: "1 1 100px" }}>
              <label className="form-label">Price</label>
              <input type="number" step="0.01" className="form-input" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            </div>
            <div style={{ flex: "1 1 80px" }}>
              <label className="form-label">Stock</label>
              <input type="number" className="form-input" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})} required />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label className="form-label">Category</label>
              <select className="form-input" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                <option value="clothes">Clothes</option>
                <option value="cosmetics">Cosmetics</option>
                <option value="grocery">Grocery</option>
              </select>
            </div>
            <div style={{ flex: "1 1 100%", display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ width: "100px", height: "100px", border: "1px dashed var(--border)", borderRadius: "8px", background: "rgba(0,0,0,0.02)", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", flexShrink: 0 }}>
                {newProduct.image ? (
                  <img src={newProduct.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", padding: "0.5rem" }}>No Image</span>
                )}
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <label className="form-label">Product Image</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" className="form-input" placeholder="Image URL..." value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} required />
                  <input type="file" id="file-upload" style={{display: 'none'}} onChange={handleFileUpload} accept="image/*" />
                  <label htmlFor="file-upload" className="btn-primary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', margin: 0 }}>
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </label>
                </div>
                <p style={{ fontSize: '0.75rem', color: "var(--text-muted)", marginTop: '0.5rem' }}>Enter a URL or upload directly from your device.</p>
              </div>
            </div>
            <div style={{ flex: "1 1 100%", marginTop: "0.5rem" }}>
              <label className="form-label">Description (Main text)</label>
              <textarea className="form-input" rows="3" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Detailed product description..."></textarea>
            </div>
            <div style={{ flex: "1 1 100%", marginTop: "0.5rem" }}>
              <label className="form-label">Technical Details / Specs (Optional)</label>
              <textarea className="form-input" rows="2" value={newProduct.details} onChange={e => setNewProduct({...newProduct, details: e.target.value})} placeholder="Dimensions, Materials, Care instructions..."></textarea>
            </div>
            <div style={{ flex: "1 1 100%", display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button type="submit" className="btn-primary">{editingId ? "Update Product" : "Save Product"}</button>
              <button type="button" className="btn-outline" onClick={() => { setAdding(false); setEditingId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)" }}>
          <RefreshCw className="animate-spin" size={20} /> Loading products...
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.2)", textAlign: "left" }}>
                <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Preview</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Name</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Category</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Stock</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Price</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "6px", overflow: "hidden" }}>
                      <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </td>
                  <td style={{ padding: "1rem", fontWeight: "600" }}>{product.name}</td>
                  <td style={{ padding: "1rem" }}>
                    <span className="badge">{product.category}</span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {product.stock > 0 
                      ? <span style={{ color: 'var(--primary-hover)', fontWeight: 'bold' }}>{product.stock} units</span> 
                      : <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Out of Stock</span>}
                  </td>
                  <td style={{ padding: "1rem" }}>₹{product.price.toFixed(2)}</td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <button className="btn-outline" style={{ padding: "0.4rem", marginRight: "0.5rem" }} onClick={() => handleEdit(product)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-outline" style={{ padding: "0.4rem", color: "#f87171", borderColor: "rgba(248, 113, 113, 0.2)" }} onClick={() => handleDelete(product.id)}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
