import React, { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import NavBar from '../components/NavBar';
import styles from '../styles/Dashboard.module.css';
import badgeStyles from '../styles/Badge.module.css';
import buttonStyles from '../styles/Button.module.css';
import { apiCall } from '../config/api';
import maintenanceService from '../services/maintenanceService';

// Maintenance dashboard now loads real data from backend
// Endpoints used:
// GET  /api/maintenance/requests  -> list requests
// PUT  /api/maintenance/:requestId -> update status/assign
// PUT  /api/maintenance/:requestId/complete -> mark completed

const MaintenanceDashboard = ({ onLogout }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getRequests();
      setRequests(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('Failed to load maintenance requests', err);
      alert('Không thể tải yêu cầu bảo trì.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAssignToMe = async (requestId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await maintenanceService.updateRequest(requestId, { assignedTo: user._id, status: 'in_progress' });
      await loadRequests();
    } catch (err) {
      console.error(err);
      alert('Không thể gán công việc');
    }
  };

  const handleComplete = async (requestId) => {
    try {
      await maintenanceService.completeRequest(requestId);
      await loadRequests();
    } catch (err) {
      console.error(err);
      alert('Không thể đánh dấu hoàn thành');
    }
  };

  return (
    <div className={styles.container}>
      <NavBar title="Bảo trì" icon={Wrench} onLogout={onLogout} />
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Yêu cầu bảo trì</h2>

        {loading ? (
          <p>Đang tải yêu cầu...</p>
        ) : requests.length === 0 ? (
          <p>Không có yêu cầu bảo trì.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map(req => (
              <div key={req._id} style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginRight: '0.75rem' }}>
                        Phòng {req.room?.roomNumber || req.room}
                      </h3>
                      <span className={`${badgeStyles.badge}`}>
                        {req.priority || 'Normal'}
                      </span>
                    </div>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{req.issueDescription || req.issue || req.description}</p>
                    <span className={`${badgeStyles.badge} ${req.status === 'pending' ? 'bg-gray-100 text-gray-800' : badgeStyles.info}`}>
                      {req.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className={`${buttonStyles.primary} ${buttonStyles.sm}`} onClick={() => handleAssignToMe(req._id)}>Gán cho tôi</button>
                    <button className={`${buttonStyles.primary} ${buttonStyles.sm}`} style={{ background: '#16a34a' }} onClick={() => handleComplete(req._id)}>
                      Hoàn thành
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceDashboard;