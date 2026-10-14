import React, { useState } from 'react';

const initialPlans = [
  { id: 1, name: 'free trial', priceMonthly: 0, priceAnnual: 0, trialDays: 30, tenants: 4 },
  { id: 2, name: 'starter', priceMonthly: 99, priceAnnual: 999, trialDays: 0, tenants: 2 },
  { id: 3, name: 'pro', priceMonthly: 1000, priceAnnual: 100000, trialDays: 14, tenants: 1 },
  { id: 4, name: 'enterprise', priceMonthly: 1000, priceAnnual: 5000, trialDays: 2, tenants: 0 },
  { id: 5, name: 'promax', priceMonthly: 'Custom', priceAnnual: 'Custom', trialDays: 0, tenants: 0 }
];

export default function Subscriptions() {
  const [plans] = useState(initialPlans);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>Subscriptions Management</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Configure subscription tiers, pricing, and active tenant allocations.</p>
        </div>
        <button style={primaryBtnStyle}>+ Add New Plan</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {plans.map((plan) => (
          <div key={plan.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#ff3f6c', backgroundColor: '#fff1f4', padding: '4px 8px', borderRadius: '6px' }}>
                  {plan.name}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={actionIconStyle}>✏️</button>
                <button style={actionIconStyle}>🗑️</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Monthly</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{typeof plan.priceMonthly === 'number' ? `₹${plan.priceMonthly}` : plan.priceMonthly}</span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Annual</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{typeof plan.priceAnnual === 'number' ? `₹${plan.priceAnnual}` : plan.priceAnnual}</span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Trial</span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#10b981' }}>{plan.trialDays}d</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#475569' }}>
              <span>Assigned Tenants:</span>
              <strong style={{ backgroundColor: '#f1f5f9', padding: '2px 10px', borderRadius: '12px', color: '#0f172a' }}>{plan.tenants}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const primaryBtnStyle = {
  backgroundColor: '#ff3f6c',
  color: '#ffffff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  boxShadow: '0 2px 4px rgba(255, 63, 108, 0.2)'
};

const actionIconStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '6px 8px',
  cursor: 'pointer',
  fontSize: '12px'
};