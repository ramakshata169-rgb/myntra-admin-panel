import React, { useState } from 'react';

const initialClients = [
  { id: 1, name: 'salon', owner: 'Priti', email: 'awarip150@gmail.com', plan: 'Free Trial', status: 'Trialing', overdue: '7 days overdue' },
  { id: 2, name: 'E2E Renamed 141', owner: 'Edited By E2E', email: 'e2e@owner.com', plan: 'Free Trial', status: 'Trialing', overdue: '1 day overdue' },
  { id: 3, name: 'E2E Test Laundry', owner: 'E2E Test Owner', email: 'laundry@test.com', plan: 'Free Trial', status: 'Trialing', overdue: '1 day overdue' },
  { id: 4, name: 'Dup Check laundry', owner: 'Dup Check', email: 'dup@check.com', plan: 'No Plan', status: 'Inactive', overdue: '' }
];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredClients = initialClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.owner.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'All') return matchesSearch;
    if (filter === 'Trialing') return matchesSearch && client.status === 'Trialing';
    return matchesSearch;
  });

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>Client & Tenant Management</h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Monitor tenant status, active trial periods, and account bindings.</p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search by shop name or owner name..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} 
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Trialing', 'Active', 'Past Due'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setFilter(tab)}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: filter === tab ? '#ff3f6c' : '#f8fafc', color: filter === tab ? '#fff' : '#475569', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Client List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredClients.map((client) => (
          <div key={client.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{client.name}</h3>
                <span style={{ fontSize: '11px', fontWeight: '600', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px' }}>{client.plan}</span>
              </div>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>Owner: <strong>{client.owner}</strong> ({client.email})</p>
              {client.overdue && <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>⚠️ {client.overdue}</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: client.status === 'Trialing' ? '#10b981' : '#64748b', backgroundColor: client.status === 'Trialing' ? '#ecfdf5' : '#f1f5f9', padding: '6px 12px', borderRadius: '20px' }}>
                {client.status.toUpperCase()}
              </span>
              <button style={{ padding: '8px 14px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', color: '#334155' }}>Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}