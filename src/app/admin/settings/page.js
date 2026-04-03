"use client";
import React, { useState, useEffect } from "react";
import { Save, Upload, Palette } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    bannerUrl: '/banner.png',
    globalTextColor: '#111111'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setSettings({
            bannerUrl: data.bannerUrl || '/banner.png',
            globalTextColor: data.globalTextColor || '#111111'
          });
        }
        setLoading(false);
      });
  }, []);

  const handleUpdateSetting = async (key, value) => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateSetting('bannerUrl', settings.bannerUrl);
    await handleUpdateSetting('globalTextColor', settings.globalTextColor);
    alert("Site customization updated!");
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading settings...</div>;

  return (
    <div>
      <h1 className="h1" style={{ fontSize: "2rem", marginBottom: "2rem" }}>Store Settings</h1>
      
      <div className="card" style={{ maxWidth: "600px", marginBottom: '2rem' }}>
        <h2 className="h2" style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>Hero Banner Settings</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><Upload size={16} /> Banner Image URL</label>
            <input 
              type="text" 
              className="form-input" 
              value={settings.bannerUrl} 
              onChange={(e) => setSettings({ ...settings, bannerUrl: e.target.value })}
              placeholder="/banner.png or external URL"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label"><Palette size={16} /> Global Website Text Color</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="color" 
                className="form-input" 
                style={{ width: '50px', padding: '2px', height: '40px' }}
                value={settings.globalTextColor} 
                onChange={(e) => setSettings({ ...settings, globalTextColor: e.target.value })}
              />
              <input 
                type="text" 
                className="form-input" 
                value={settings.globalTextColor} 
                onChange={(e) => setSettings({ ...settings, globalTextColor: e.target.value })}
              />
            </div>
          </div>
          
          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
            <button type="submit" className="btn-primary">
              <Save size={18} /> Update Store Personality
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ maxWidth: "600px" }}>
        <h2 className="h2" style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>General Settings</h2>
        <form>
          <div className="form-group">
            <label className="form-label">Store Name</label>
            <input type="text" className="form-input" defaultValue="Flashmart" disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Support Email</label>
            <input type="email" className="form-input" defaultValue="support@flashmart.com" disabled />
          </div>
        </form>
      </div>
    </div>
  );
}
