import React from 'react';
import { Users } from 'lucide-react';
import NavBar from '../components/NavBar';
import { mockRooms } from '../data/mockData';
import styles from '../styles/Dashboard.module.css';
import badgeStyles from '../styles/Badge.module.css';
import buttonStyles from '../styles/Button.module.css';

const HousekeepingDashboard = ({ onLogout }) => {
  return (
    <div className={styles.container}>
      <NavBar title="Nhân viên dọn phòng" icon={Users} onLogout={onLogout} />
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Danh sách công việc hôm nay</h2>
        <div className={`${styles.grid} ${styles.gridRooms}`}>
          {mockRooms.map(room => (
            <div key={room.id} style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1f2937' }}>Phòng {room.number}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tầng {room.floor}</p>
                </div>
                <span className={`
                  ${badgeStyles.badge}
                  ${room.status === 'Available' ? badgeStyles.success : ''}
                  ${room.status === 'Occupied' ? badgeStyles.occupied : ''}
                  ${room.status === 'Maintenance' ? badgeStyles.warning : ''}
                `}>
                  {room.status}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#374151' }}>
                  <input type="checkbox" style={{ marginRight: '0.5rem' }} /> Dọn dẹp phòng
                </label>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#374151' }}>
                  <input type="checkbox" style={{ marginRight: '0.5rem' }} /> Thay ga giường
                </label>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#374151' }}>
                  <input type="checkbox" style={{ marginRight: '0.5rem' }} /> Bổ sung vật dụng
                </label>
              </div>
              <button className={`${buttonStyles.primary} ${buttonStyles.md}`} style={{ width: '100%' }}>
                Hoàn thành
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HousekeepingDashboard;