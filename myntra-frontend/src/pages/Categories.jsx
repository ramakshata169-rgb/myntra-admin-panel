import React, { useState } from 'react';

const initialCategories = [
  { id: 1, name: 'Men', description: 'Men\'s fashion, clothing, and accessories', itemCount: 120 },
  { id: 2, name: 'Women', description: 'Women\'s fashion, ethnic wear, and Western wear', itemCount: 150 },
  { id: 3, name: 'Kids / Child', description: 'Clothing and toys for infants and kids', itemCount: 85 },
  { id: 4, name: 'Footwear', description: 'Shoes, sneakers, and sandals for all', itemCount: 60 },
  { id: 5, name: 'Accessories', description: 'Watches, bags, belts, and sunglasses', itemCount: 45 }
];

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;

    const newCategory = {
      id: Date.now(),
      name: newCatName,
      description: newCatDesc,
      itemCount: 0
    };

    setCategories([...categories, newCategory]);
    setNewCatName('');
    setNewCatDesc('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Manage Categories</h2>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Add New Category</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Category Name (e.g. Men, Women, Kids)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            style={{ padding: '8px', width: '250px', marginRight: '10px' }}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newCatDesc}
            onChange={(e) => setNewCatDesc(e.target.value)}
            style={{ padding: '8px', width: '300px', marginRight: '10px' }}
          />
          <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#ff3f6c', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Add Category
          </button>
        </div>
      </form>

      {/* Categories List Table */}
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>ID</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>Total Products</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td><strong>{cat.name}</strong></td>
              <td>{cat.description}</td>
              <td>{cat.itemCount} items</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}