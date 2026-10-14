import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Products', icon: '🛍️' },
    { path: '/orders', label: 'Orders', icon: '📦' },
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/categories', label: 'Category', icon: '📁' },
    { path: '/subscriptions', label: 'Subscriptions', icon: '💳' },
    { path: '/clients', label: 'Clients / Tenants', icon: '🏢' },
    { path: '/ai-styling', label: 'AI Styling', icon: '✨' },
  ];

  return (
    <aside style={{ width: '260px', backgroundColor: '#1e1b4b', color: '#fff', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, boxSizing: 'border-box' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: '#ff3f6c', color: '#fff', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>M</div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Myntra Admin</h2>
        </div>
      </div>

      <nav style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', textDecoration: 'none', color: isActive ? '#fff' : '#94a3b8', backgroundColor: isActive ? '#ff3f6c' : 'transparent', fontWeight: isActive ? '600' : '500', fontSize: '14px', transition: 'background 0.2s' }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={onLogout} style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>
          Logout
        </button>
      </div>
    </aside>
  );
}