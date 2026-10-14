import React, { useState } from 'react';

const initialOrders = [
  { id: 'ORD-9821', customer: 'Rahul Sharma', item: 'Silk Blend Banarasi Saree', amount: 3499, status: 'Delivered', date: '12 Oct 2026' },
  { id: 'ORD-9822', customer: 'Priya Verma', item: 'Women Floral Print Kurta', amount: 1499, status: 'Processing', date: '13 Oct 2026' },
  { id: 'ORD-9823', customer: 'Amit Kumar', item: 'Men Leather White Sneakers', amount: 1999, status: 'Shipped', date: '13 Oct 2026' },
  { id: 'ORD-9824', customer: 'Neha Singh', item: 'Women Off-Shoulder Evening Dress', amount: 2299, status: 'Cancelled', date: '11 Oct 2026' }
];

export default function Orders() {
  const [orders] = useState(initialOrders);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return { bg: '#dcfce7', color: '#166534' };
      case 'Shipped': return { bg: '#e0f2fe', color: '#0369a1' };
      case 'Processing': return { bg: '#fef9c3', color: '#854d0e' };
      case 'Cancelled': return { bg: '#fee2e2', color: '#991b1b' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>Orders Management</h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Monitor customer purchases, fulfillment status, and order history.</p>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#334155' }}>Recent Customer Orders ({orders.length})</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 24px' }}>Order ID</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Product</th>
                <th style={{ padding: '12px 16px' }}>Amount</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 24px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => {
                const badge = getStatusStyle(ord.status);
                return (
                  <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                    <td style={{ padding: '12px 24px', fontWeight: '600', color: '#3b82f6' }}>{ord.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#0f172a' }}>{ord.customer}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{ord.item}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0f172a' }}>₹{ord.amount}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ backgroundColor: badge.bg, color: badge.color, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 24px', color: '#64748b', fontSize: '13px' }}>{ord.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}