import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { mockBookings } from '../../data/mockData';
import styles from '../../styles/Dashboard.module.css';
import buttonStyles from '../../styles/Button.module.css';

const CheckInOutTab = () => (
  <div>
    <h2 className={styles.sectionTitle}>Check-in & Check-out</h2>
    <div className={styles.grid} style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <CheckCircle className="text-green-600" size={24} style={{ marginRight: '0.5rem' }} /> Check-in hôm nay
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mockBookings.filter(b => b.checkIn === '2025-11-10').map(booking => (
            <div key={booking.id} style={{ borderLeft: '4px solid #22c55e', paddingLeft: '1rem' }}>
              <p style={{ fontWeight: 500, color: '#1f2937' }}>{booking.customer}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Phòng {booking.room}</p>
              <button className={`${buttonStyles.primary} ${buttonStyles.sm}`} style={{ marginTop: '0.5rem' }}>
                Check-in
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <XCircle className="text-red-600" size={24} style={{ marginRight: '0.5rem' }} /> Check-out hôm nay
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mockBookings.filter(b => b.checkOut === '2025-11-12').map(booking => (
            <div key={booking.id} style={{ borderLeft: '4px solid #ef4444', paddingLeft: '1rem' }}>
              <p style={{ fontWeight: 500, color: '#1f2937' }}>{booking.customer}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Phòng {booking.room}</p>
              <button className={`${buttonStyles.primary} ${buttonStyles.sm}`} style={{ marginTop: '0.5rem', background: '#dc2626' }}>
                Check-out
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CheckInOutTab;