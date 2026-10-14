import React, { useState, useEffect } from 'react';
import { useLanguage } from './Context/LanguageContext';
import { useTheme } from './Context/ThemeContext';

export default function App() {
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('dashboard');

  // Multi-Tenant & Subscription States
  const [subTab, setSubTab] = useState('subscriptions');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [viewTenantPlan, setViewTenantPlan] = useState(null);
  const [clientFilter, setClientFilter] = useState('All');
  const [clientSearch, setClientSearch] = useState('');

  // Branding Customization State
  const [primaryColor, setPrimaryColor] = useState('#ff3f6c');
  const [appTitle, setAppTitle] = useState('Myntra Admin SaaS');

  // Data States
  const [products, setProducts] = useState([
    { id: 'PROD-101', name: 'Silk Blend Banarasi Saree', category: 'Apparel', price: 3499, stock: 25 },
    { id: 'PROD-102', name: 'Women Floral Print Kurta', category: 'Apparel', price: 1499, stock: 40 },
    { id: 'PROD-103', name: 'Men Leather White Sneakers', category: 'Footwear', price: 1999, stock: 18 },
    { id: 'PROD-104', name: 'Women Evening Dress', category: 'Apparel', price: 2299, stock: 12 }
  ]);

  const [orders] = useState([
    { id: 'ORD-9821', customer: 'Rahul Sharma', product: 'Silk Blend Banarasi Saree', amount: '₹3,499', status: 'Delivered', date: '12 Oct 2026' },
    { id: 'ORD-9822', customer: 'Priya Verma', product: 'Women Floral Print Kurta', amount: '₹1,499', status: 'Processing', date: '13 Oct 2026' },
    { id: 'ORD-9823', customer: 'Amit Kumar', product: 'Men Leather White Sneakers', amount: '₹1,999', status: 'Shipped', date: '13 Oct 2026' },
    { id: 'ORD-9824', customer: 'Neha Singh', product: 'Women Evening Dress', amount: '₹2,299', status: 'Delivered', date: '13 Oct 2026' }
  ]);

  const [customers] = useState([
    { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+91 98765 43210', orders: '4 orders', spent: '₹12,499' },
    { name: 'Priya Verma', email: 'priya.v@yahoo.com', phone: '+91 91234 56789', orders: '2 orders', spent: '₹3,998' },
    { name: 'Amit Kumar', email: 'amit.kumar@outlook.com', phone: '+91 99887 76655', orders: '6 orders', spent: '₹18,450' },
    { name: 'Neha Singh', email: 'neha.singh@gmail.com', phone: '+91 97654 32109', orders: '1 order', spent: '₹2,299' }
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Men', desc: "Men's fashion, clothing, and accessories", count: '120 items' },
    { id: 2, name: 'Women', desc: "Women's fashion, ethnic wear, and Western wear", count: '180 items' },
    { id: 3, name: 'Kids / Child', desc: 'Clothing and toys for infants and kids', count: '90 items' },
    { id: 4, name: 'Footwear', desc: 'Shoes, sneakers, and sandals for all', count: '65 items' },
    { id: 5, name: 'Accessories', desc: 'Watches, bags, belts, and sunglasses', count: '110 items' }
  ]);

  const [subscriptionPlans] = useState([
    { name: 'free trial', code: 'FREE_TRIAL', monthly: '₹0', annual: '₹0', trial: '30 Days', tenants: 7 },
    { name: 'starter', code: 'STARTER', monthly: '₹99', annual: '₹999', trial: 'None', tenants: 0 },
    { name: 'pro', code: 'PRO', monthly: '₹1,000', annual: '₹10,000', trial: '14 Days', tenants: 0 },
    { name: 'enterprise', code: 'ENTERPRISE', monthly: '₹1,000', annual: '₹5,000', trial: '2 Days', tenants: 0 },
    { name: 'promax', code: 'CUSTOM', monthly: 'Custom', annual: 'Custom', trial: 'Custom', tenants: 0 }
  ]);

  const [tenants, setTenants] = useState([
    { id: 1, name: 'Salon Pro', owner: 'Priti', email: 'awarip150@gmail.com', service: 'vehicle_wash', plan: 'FREE_TRIAL', status: 'TRIALING', overdue: '7 days overdue', branches: 1, staff: 0, customers: 0 },
    { id: 2, name: 'Qwert Cleaners', owner: 'Qwert', email: 'luctiwari@gmail.com', service: 'laundry', plan: 'FREE_TRIAL', status: 'TRIALING', overdue: 'None', branches: 1, staff: 2, customers: 12 },
    { id: 3, name: 'ABC Textiles', owner: 'ABC Admin', email: 'abc@gmail.com', service: 'laundry', plan: 'FREE_TRIAL', status: 'TRIALING', overdue: 'None', branches: 1, staff: 0, customers: 0 },
    { id: 4, name: 'Repro Biz 202', owner: 'Repro Owner', email: 'repro@gmail.com', service: 'laundry', plan: 'FREE_TRIAL', status: 'TRIALING', overdue: '1 day overdue', branches: 2, staff: 4, customers: 45 }
  ]);

  // Form States
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Apparel');
  const [pPrice, setPPrice] = useState('');
  const [pStock, setPStock] = useState('');
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // MongoDB background sync
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8787/api/products').then((res) => res.json()).catch(() => []),
      fetch('http://localhost:8787/api/tenants').then((res) => res.json()).catch(() => [])
    ]).then(([prodRes, tenRes]) => {
      if (Array.isArray(prodRes) && prodRes.length > 0) setProducts(prodRes);
      if (Array.isArray(tenRes) && tenRes.length > 0) setTenants(tenRes);
    });
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!pName || !pPrice || !pStock) return;
    const newProd = { name: pName, category: pCategory, price: Number(pPrice), stock: Number(pStock) };

    try {
      const res = await fetch('http://localhost:8787/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts((prev) => [...prev, saved]);
      } else {
        setProducts((prev) => [...prev, { id: `PROD-${Date.now()}`, ...newProd }]);
      }
    } catch (err) {
      setProducts((prev) => [...prev, { id: `PROD-${Date.now()}`, ...newProd }]);
    }
    setPName(''); setPPrice(''); setPStock('');
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:8787/api/products/${id}`, { method: 'DELETE' });
    } catch (err) {}
    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!catName) return;
    setCategories((prev) => [...prev, { id: prev.length + 1, name: catName, desc: catDesc || 'General Apparel', count: '0 items' }]);
    setCatName(''); setCatDesc('');
  };

  const filteredClients = tenants.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(clientSearch.toLowerCase()) || t.owner.toLowerCase().includes(clientSearch.toLowerCase());
    if (clientFilter === 'All') return matchesSearch;
    if (clientFilter === 'TRIALING') return matchesSearch && t.status === 'TRIALING';
    if (clientFilter === 'ACTIVE') return matchesSearch && t.status === 'ACTIVE';
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme?.isDarkMode ? '#090d16' : '#f8fafc', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      
      {/* Sidebar Panel */}
      <aside style={{ width: '260px', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px 20px', flexShrink: 0, borderRight: '1px solid #1e293b' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px', paddingLeft: '4px' }}>
            <div style={{ background: 'linear-gradient(135deg, #ff3f6c 0%, #e11d48 100%)', color: '#ffffff', fontWeight: '900', fontSize: '18px', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255, 63, 108, 0.35)' }}>
              M
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: '800', letterSpacing: '-0.3px', margin: 0, lineHeight: '1.2' }}>{appTitle}</h2>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>Admin Portal</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'dashboard', icon: '⚡', label: 'Dashboard' },
              { id: 'products', icon: '🛍️', label: 'Products' },
              { id: 'categories', icon: '📁', label: 'Category' },
              { id: 'orders', icon: '📦', label: 'Orders' },
              { id: 'customers', icon: '👥', label: 'Customers' },
              { id: 'subscriptions', icon: '💳', label: 'Subscriptions' }
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSelectedTenant(null); setViewTenantPlan(null); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(255, 63, 108, 0.15)' : 'transparent',
                    color: isActive ? '#ff3f6c' : '#94a3b8',
                    fontSize: '14px',
                    fontWeight: isActive ? '700' : '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? 'inset 0 0 0 1px rgba(255, 63, 108, 0.4)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Workspace */}
      <main style={{ flex: 1, padding: '36px 44px', overflowY: 'auto' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: theme?.isDarkMode ? '#1e293b' : '#ffffff', color: theme?.isDarkMode ? '#ffffff' : '#0f172a', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
            {theme?.isDarkMode ? '☀️ Bright Mode' : '🌙 Dark Mode'}
          </button>
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: theme?.isDarkMode ? '#1e293b' : '#ffffff', color: theme?.isDarkMode ? '#ffffff' : '#0f172a', fontWeight: '600', fontSize: '13px', cursor: 'pointer', outline: 'none' }}>
            <option value="en">🌐 English (US)</option>
            <option value="hi">🇮🇳 हिंदी (Hindi)</option>
            <option value="mr">🇮🇳 मराठी (Marathi)</option>
          </select>
        </div>

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ marginBottom: '36px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: theme?.isDarkMode ? '#ffffff' : '#0f172a', letterSpacing: '-0.5px' }}>Platform Control Dashboard</h1>
              <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Overview of catalog items, client tenants, active orders, and customer management.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1100px' }}>
              <div onClick={() => setActiveTab('products')} style={dashboardCardStyle(theme)}>
                <div style={iconBadgeStyle('#3b82f6')}>🛍️</div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: theme?.isDarkMode ? '#ffffff' : '#0f172a', marginBottom: '6px' }}>Products</h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Manage inventory, pricing & live stock</p>
                <span style={cardLinkStyle}>Access Inventory →</span>
              </div>

              <div onClick={() => setActiveTab('categories')} style={dashboardCardStyle(theme)}>
                <div style={iconBadgeStyle('#8b5cf6')}>📁</div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: theme?.isDarkMode ? '#ffffff' : '#0f172a', marginBottom: '6px' }}>Categories</h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Men, Women, Kids & Accessories</p>
                <span style={cardLinkStyle}>Manage Taxonomy →</span>
              </div>

              <div onClick={() => setActiveTab('orders')} style={dashboardCardStyle(theme)}>
                <div style={iconBadgeStyle('#10b981')}>📦</div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: theme?.isDarkMode ? '#ffffff' : '#0f172a', marginBottom: '6px' }}>Orders</h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Track customer orders & fulfillment</p>
                <span style={cardLinkStyle}>View Purchases →</span>
              </div>

              <div onClick={() => setActiveTab('customers')} style={dashboardCardStyle(theme)}>
                <div style={iconBadgeStyle('#f59e0b')}>👥</div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: theme?.isDarkMode ? '#ffffff' : '#0f172a', marginBottom: '6px' }}>Customers</h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Customer list, contacts & total spend</p>
                <span style={cardLinkStyle}>Directory →</span>
              </div>

              <div onClick={() => setActiveTab('subscriptions')} style={dashboardCardStyle(theme)}>
                <div style={iconBadgeStyle('#06b6d4')}>💳</div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: theme?.isDarkMode ? '#ffffff' : '#0f172a', marginBottom: '6px' }}>Subscriptions</h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>SaaS client plans, billing & status</p>
                <span style={cardLinkStyle}>Manage Tenants →</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. SUBSCRIPTIONS PANEL */}
        {activeTab === 'subscriptions' && (
          <div>
            <div style={{ display: 'flex', gap: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '28px' }}>
              <button onClick={() => { setSubTab('subscriptions'); setSelectedTenant(null); setViewTenantPlan(null); }} style={{ background: 'none', border: 'none', fontWeight: '800', fontSize: '16px', color: subTab === 'subscriptions' && !selectedTenant && !viewTenantPlan ? '#ff3f6c' : '#64748b', cursor: 'pointer' }}>
                💳 Subscription Plans
              </button>
              <button onClick={() => { setSubTab('clients'); setSelectedTenant(null); setViewTenantPlan(null); }} style={{ background: 'none', border: 'none', fontWeight: '800', fontSize: '16px', color: subTab === 'clients' && !selectedTenant ? '#ff3f6c' : '#64748b', cursor: 'pointer' }}>
                🏢 Tenants & Clients ({tenants.length})
              </button>
              <button onClick={() => { setSubTab('settings'); setSelectedTenant(null); setViewTenantPlan(null); }} style={{ background: 'none', border: 'none', fontWeight: '800', fontSize: '16px', color: subTab === 'settings' ? '#ff3f6c' : '#64748b', cursor: 'pointer' }}>
                ⚙️ Branding Settings
              </button>
            </div>

            {subTab === 'subscriptions' && !selectedTenant && !viewTenantPlan && (
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px' }}>Active SaaS Tiers</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {subscriptionPlans.map((plan, idx) => (
                    <div key={idx} style={{ backgroundColor: theme?.cardBg || '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a' }}>{plan.name}</h3>
                        <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px' }}>{plan.code}</span>
                      </div>
                      <div style={{ margin: '18px 0' }}>
                        <span style={{ fontSize: '28px', fontWeight: '900', color: '#ff3f6c' }}>{plan.monthly}</span>
                        <span style={{ color: '#64748b', fontSize: '13px' }}> / month</span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Annual Plan: <strong>{plan.annual}</strong> · Trial: <strong>{plan.trial}</strong></p>
                      <button onClick={() => setViewTenantPlan(plan.name)} style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                        View Tenants ({plan.tenants}) →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subTab === 'clients' && !selectedTenant && (
              <div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <input type="text" placeholder="🔍 Search shop name or owner name..." value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} style={{ flex: 1, maxWidth: '400px', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#ffffff' }} />
                  {['All', 'TRIALING', 'ACTIVE'].map((f) => (
                    <button key={f} onClick={() => setClientFilter(f)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: '700', backgroundColor: clientFilter === f ? '#ff3f6c' : '#ffffff', color: clientFilter === f ? '#ffffff' : '#475569', cursor: 'pointer' }}>{f}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredClients.map((tenant) => (
                    <div key={tenant.id} onClick={() => setSelectedTenant(tenant)} style={{ backgroundColor: theme?.cardBg || '#ffffff', padding: '20px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <div>
                        <h4 style={{ fontWeight: '800', fontSize: '17px', color: '#0f172a', margin: 0 }}>{tenant.name}</h4>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Owner: {tenant.owner} ({tenant.email})</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>{tenant.status}</span>
                        <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600', marginTop: '6px', margin: 0 }}>{tenant.overdue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subTab === 'settings' && (
              <div style={{ maxWidth: '600px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>Platform Customization</h2>
                <div style={{ backgroundColor: theme?.cardBg || '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Application Workspace Title</label>
                    <input type="text" value={appTitle} onChange={(e) => setAppTitle(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                  </div>
                  <button onClick={() => alert('Branding configuration saved successfully!')} style={{ width: '100%', backgroundColor: primaryColor, color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>
                    Save Branding Configuration
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. PRODUCTS PANEL */}
        {activeTab === 'products' && (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>Products Inventory</h1>
            <div style={{ backgroundColor: theme?.cardBg || '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '28px' }}>
              <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                <input type="text" placeholder="Product Title" value={pName} onChange={(e) => setPName(e.target.value)} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} required />
                <select value={pCategory} onChange={(e) => setPCategory(e.target.value)} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}>
                  <option value="Apparel">Apparel</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                </select>
                <input type="number" placeholder="Price (₹)" value={pPrice} onChange={(e) => setPPrice(e.target.value)} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} required />
                <input type="number" placeholder="Stock Units" value={pStock} onChange={(e) => setPStock(e.target.value)} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} required />
                <button type="submit" style={{ backgroundColor: '#ff3f6c', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>Add Item</button>
              </form>
            </div>
            <div style={{ backgroundColor: theme?.cardBg || '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '16px 24px' }}>PRODUCT NAME</th>
                    <th style={{ padding: '16px 24px' }}>CATEGORY</th>
                    <th style={{ padding: '16px 24px' }}>PRICE</th>
                    <th style={{ padding: '16px 24px' }}>STOCK</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id || p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 24px', fontWeight: '700' }}>{p.name}</td>
                      <td style={{ padding: '16px 24px', color: '#64748b' }}>{p.category}</td>
                      <td style={{ padding: '16px 24px', fontWeight: '800' }}>₹{p.price}</td>
                      <td style={{ padding: '16px 24px' }}>{p.stock} units</td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteProduct(p._id || p.id)} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. CATEGORIES PANEL */}
        {activeTab === 'categories' && (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>Category Structure</h1>
            <div style={{ backgroundColor: theme?.cardBg || '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '28px' }}>
              <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '14px' }}>
                <input type="text" placeholder="Category Name" value={catName} onChange={(e) => setCatName(e.target.value)} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: 1 }} />
                <input type="text" placeholder="Category Description" value={catDesc} onChange={(e) => setCatDesc(e.target.value)} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: 2 }} />
                <button type="submit" style={{ backgroundColor: '#ff3f6c', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>Add Category</button>
              </form>
            </div>
            <div style={{ backgroundColor: theme?.cardBg || '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '16px 24px' }}>ID</th>
                    <th style={{ padding: '16px 24px' }}>NAME</th>
                    <th style={{ padding: '16px 24px' }}>DESCRIPTION</th>
                    <th style={{ padding: '16px 24px' }}>ITEMS COUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 24px', color: '#94a3b8' }}>#{cat.id}</td>
                      <td style={{ padding: '16px 24px', fontWeight: '800' }}>{cat.name}</td>
                      <td style={{ padding: '16px 24px', color: '#64748b' }}>{cat.desc}</td>
                      <td style={{ padding: '16px 24px', fontWeight: '700' }}>{cat.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. ORDERS PANEL */}
        {activeTab === 'orders' && (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>Customer Orders</h1>
            <div style={{ backgroundColor: theme?.cardBg || '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '16px 24px' }}>ORDER ID</th>
                    <th style={{ padding: '16px 24px' }}>CUSTOMER</th>
                    <th style={{ padding: '16px 24px' }}>PRODUCT</th>
                    <th style={{ padding: '16px 24px' }}>AMOUNT</th>
                    <th style={{ padding: '16px 24px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 24px', fontWeight: '800', color: '#2563eb' }}>{o.id}</td>
                      <td style={{ padding: '16px 24px', fontWeight: '700' }}>{o.customer}</td>
                      <td style={{ padding: '16px 24px', color: '#64748b' }}>{o.product}</td>
                      <td style={{ padding: '16px 24px', fontWeight: '800' }}>{o.amount}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ backgroundColor: o.status === 'Delivered' ? '#dcfce7' : '#fef3c7', color: o.status === 'Delivered' ? '#166534' : '#92400e', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. CUSTOMERS PANEL */}
        {activeTab === 'customers' && (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>Customer Directory</h1>
            <div style={{ backgroundColor: theme?.cardBg || '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '16px 24px' }}>NAME</th>
                    <th style={{ padding: '16px 24px' }}>EMAIL</th>
                    <th style={{ padding: '16px 24px' }}>PHONE</th>
                    <th style={{ padding: '16px 24px' }}>LIFETIME SPENT</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 24px', fontWeight: '700' }}>{c.name}</td>
                      <td style={{ padding: '16px 24px', color: '#64748b' }}>{c.email}</td>
                      <td style={{ padding: '16px 24px', color: '#64748b' }}>{c.phone}</td>
                      <td style={{ padding: '16px 24px', fontWeight: '800', color: '#166534' }}>{c.spent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// Inline Styles Helpers
const dashboardCardStyle = (theme) => ({
  backgroundColor: theme?.cardBg || '#ffffff',
  padding: '28px 24px',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  textAlign: 'left',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
  transition: 'all 0.2s ease'
});

const iconBadgeStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: '#ffffff',
  width: '42px',
  height: '42px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  marginBottom: '18px'
});

const cardLinkStyle = {
  display: 'inline-block',
  marginTop: '16px',
  fontSize: '13px',
  fontWeight: '700',
  color: '#2563eb'
};