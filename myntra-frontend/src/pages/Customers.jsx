import React, { useState } from 'react';

const initialCustomers = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+91 98765 43210', ordersCount: 4, spent: 12499 },
  { id: 2, name: 'Priya Verma', email: 'priya.v@yahoo.com', phone: '+91 91234 56789', ordersCount: 2, spent: 3998 },
  { id: 3, name: 'Amit Kumar', email: 'amit.kumar@outlook.com', phone: '+91 99887 76655', ordersCount: 6, spent: 18450 },
  { id: 4, name: 'Neha Singh', email: 'neha.singh@gmail.com', phone: '+91 97654 32109', ordersCount: 1, spent: 2299 }
];

export default function Customers() {
  const [customers] = useState(initialCustomers);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>Customer Management</h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>View registered customers, contact details, and lifetime order values.</p>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#334155' }}>Active Customers Directory ({customers.length})</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 24px' }}>Customer Name</th>
                <th style={{ padding: '12px 16px' }}>Email Address</th>
                <th style={{ padding: '12px 16px' }}>Phone Number</th>
                <th style={{ padding: '12px 16px' }}>Total Orders</th>
                <th style={{ padding: '12px 24px' }}>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                  <td style={{ padding: '12px 24px', fontWeight: '600', color: '#0f172a' }}>{cust.name}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{cust.email}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{cust.phone}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#334155' }}>
                      {cust.ordersCount} orders
                    </span>
                  </td>
                  <td style={{ padding: '12px 24px', fontWeight: '600', color: '#10b981' }}>₹{cust.spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}