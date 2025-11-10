import React, { useState } from 'react';
import { Home, Calendar, Bed, LogIn } from 'lucide-react';
import NavBar from '../components/NavBar';
import BookingsTab from '../components/receptionist/BookingsTab';
import RoomsTab from '../components/receptionist/RoomsTab';
import CheckInOutTab from '../components/receptionist/CheckInOutTab';
import styles from '../styles/Dashboard.module.css';

const ReceptionistDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('bookings');

  const tabs = [
    { id: 'bookings', label: 'Đặt phòng', icon: Calendar },
    { id: 'rooms', label: 'Phòng', icon: Bed },
    { id: 'checkin', label: 'Check-in/Check-out', icon: LogIn },
  ];

  return (
    <div className={styles.container}>
      <NavBar title="Lễ tân" icon={Home} onLogout={onLogout} />
      
      <div className={styles.content}>
        {/* === TAB NAVIGATION – ĐẸP, CÓ ICON === */}
        <div className={styles.tabNav}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              >
                <Icon size={18} className={styles.tabIcon} />
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* === TAB CONTENT === */}
        <div className={styles.tabContent}>
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'rooms' && <RoomsTab />}
          {activeTab === 'checkin' && <CheckInOutTab />}
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;