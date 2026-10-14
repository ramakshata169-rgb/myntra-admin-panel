import React, { useState, useEffect } from 'react';
import { useLanguage } from '../Context/LanguageContext';
import { useTheme } from '../Context/ThemeContext';

export default function Products() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Form input states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');

  // 1. Fetch products from MongoDB Backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8787/api/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products from MongoDB:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Add New Product to MongoDB Database
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock) {
      alert('Please fill in Name, Price, and Stock fields.');
      return;
    }

    const newProduct = {
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      image: image || 'https://via.placeholder.com/150'
    };

    try {
      const response = await fetch('http://localhost:8787/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        const savedProduct = await response.json();
        setProducts((prev) => [...prev, savedProduct]);
        
        // Reset form inputs
        setName('');
        setCategory('Apparel');
        setPrice('');
        setStock('');
        setImage('');
        alert('Product added successfully to MongoDB database!');
      } else {
        alert('Failed to save product in MongoDB.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Backend server not responding on http://localhost:8787');
    }
  };

  // 3. Delete Product from MongoDB
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:8787/api/products/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((item) => item._id !== id && item.id !== id));
      } else {
        alert('Failed to delete product from database.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div style={{ background: theme?.cardBg || '#ffffff', color: theme?.text || '#0f172a', padding: '24px', borderRadius: '12px', border: `1px solid ${theme?.border || '#e2e8f0'}` }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{t('products')} Management</h2>
          <p style={{ color: theme?.subText || '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Connected to MongoDB (`myntra_saas_db`)
          </p>
        </div>

        {/* Category Filter Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={inputStyle(theme)}
        >
          <option value="All">All Categories</option>
          <option value="Apparel">Apparel</option>
          <option value="Footwear">Footwear</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Add New Product Form */}
      <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px', background: theme?.bg || '#f8fafc', padding: '16px', borderRadius: '8px', border: `1px solid ${theme?.border || '#e2e8f0'}` }}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle(theme)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle(theme)}>
          <option value="Apparel">Apparel</option>
          <option value="Footwear">Footwear</option>
          <option value="Accessories">Accessories</option>
        </select>
        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={inputStyle(theme)}
          required
        />
        <input
          type="number"
          placeholder="Stock Count"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          style={inputStyle(theme)}
          required
        />
        <input
          type="text"
          placeholder="Image URL (Optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={inputStyle(theme)}
        />
        <button type="submit" style={btnStyle}>
          ➕ Add to MongoDB
        </button>
      </form>

      {/* Products Table */}
      {loading ? (
        <p>Loading products from MongoDB database...</p>
      ) : filteredProducts.length === 0 ? (
        <p style={{ color: theme?.subText }}>No products found in this category.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${theme?.border || '#e2e8f0'}`, color: theme?.subText }}>
                <th style={{ padding: '12px' }}>Product</th>
                <th style={{ padding: '12px' }}>Category</th>
                <th style={{ padding: '12px' }}>Price</th>
                <th style={{ padding: '12px' }}>Stock</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const prodId = p._id || p.id;
                return (
                  <tr key={prodId} style={{ borderBottom: `1px solid ${theme?.border || '#e2e8f0'}` }}>
                    <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={p.image || 'https://via.placeholder.com/40'}
                        alt={p.name}
                        style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: '600' }}>{p.name}</span>
                    </td>
                    <td style={{ padding: '12px' }}>{p.category || 'General'}</td>
                    <td style={{ padding: '12px', fontWeight: '600' }}>₹{p.price}</td>
                    <td style={{ padding: '12px' }}>{p.stock} units</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteProduct(prodId)}
                        style={deleteBtnStyle}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Inline Styles
const inputStyle = (theme) => ({
  padding: '10px 12px',
  borderRadius: '6px',
  border: `1px solid ${theme?.border || '#cbd5e1'}`,
  background: theme?.cardBg || '#ffffff',
  color: theme?.text || '#0f172a',
  outline: 'none',
  fontSize: '14px'
});

const btnStyle = {
  background: '#ff3f6c',
  color: '#ffffff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const deleteBtnStyle = {
  background: '#ef4444',
  color: '#ffffff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px'
};