import React from 'react';
import { Wrench } from 'lucide-react';
import NavBar from '../components/NavBar';
import { maintenanceRequests } from '../data/mockData';
import styles from '../styles/Dashboard.module.css';
import badgeStyles from '../styles/Badge.module.css';
import buttonStyles from '../styles/Button.module.css';

const MaintenanceDashboard = ({ onLogout }) => {
  return (
    <div className={styles.container}>
      <NavBar title="Bảo trì" icon={Wrench} onLogout={onLogout} />
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Yêu cầu bảo trì</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {maintenanceRequests.map(request => (
            <div key={request.id} style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginRight: '0.75rem' }}>
                      Phòng {request.room}
                    </h3>
                    <span className={`
                      ${badgeStyles.badge}
                      ${request.priority === 'High' ? 'bg-red-100 text-red-800' : ''}
                      ${request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${request.priority === 'Low' ? 'bg-green-100 text-green-800' : ''}
                    `}>
                      {request.priority}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{request.issue}</p>
                  <span className={`${badgeStyles.badge} ${request.status === 'Pending' ? 'bg-gray-100 text-gray-800' : badgeStyles.info}`}>
                    {request.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className={`${buttonStyles.primary} ${buttonStyles.sm}`}>Bắt đầu</button>
                  <button className={`${buttonStyles.primary} ${buttonStyles.sm}`} style={{ background: '#16a34a' }}>
                    Hoàn thành
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;