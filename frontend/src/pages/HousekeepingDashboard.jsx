// src/pages/HousekeepingDashboard.jsx

import React, { useEffect, useState } from 'react';
import { Users, Wrench, Eye, Brush, CheckCircle } from 'lucide-react';
import NavBar from '../components/NavBar';
import styles from '../styles/Dashboard.module.css';
import badgeStyles from '../styles/Badge.module.css';
import buttonStyles from '../styles/Button.module.css';
import { apiCall } from '../config/api';
import { roomService } from '../services/roomService';
import maintenanceService from '../services/maintenanceService';

const HousekeepingDashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({
    dirty: 0,
    cleaning: 0,
    ready: 0,
    maintenance: 0,
    occupied: 0,
  });
  const [cleaningRooms, setCleaningRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(true);

  // Load stats + danh sách phòng cần dọn
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

  // 1. Stats tổng quan
  const statsResp = await roomService.getRealtimeRoomStatus();
  // statsResp: { totalRooms, statsByStatus: [{ _id: 'available', count: 10 }, ...] }
  const map = {};
  (statsResp.statsByStatus || []).forEach(s => { map[s._id] = s.count; });
        setStats({
          dirty: map['dirty'] || 0,
          cleaning: map['cleaning'] || 0,
          ready: map['available'] || 0,
          maintenance: map['maintenance'] || 0,
          occupied: map['occupied'] || 0,
        });

        // 2. Danh sách phòng cần dọn
  const rooms = await roomService.getCleaningRooms();
  // rooms is expected to be an array of room objects
  setCleaningRooms(Array.isArray(rooms) ? rooms : (rooms.data || []));
      } catch (err) {
        console.error('Error loading housekeeping data:', err);
        alert('Không tải được dữ liệu dọn phòng. Vui lòng thử lại hoặc kiểm tra backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Bắt đầu dọn phòng
  const handleStartCleaning = async (room) => {
    try {
      const id = room._id || room.roomId || room.id;
      await roomService.updateRoomStatus(id, 'cleaning');
      alert(`Đã chuyển phòng ${room.number || room.roomNumber || room.roomNumber} sang trạng thái "Đang dọn".`);
      // Cập nhật UI local
      setCleaningRooms(prev => prev.map(r => (r._id || r.roomId || r.id) === id ? { ...r, status: 'cleaning' } : r));
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật trạng thái phòng.');
    }
  };

  // Hoàn tất dọn phòng
  const handleFinishCleaning = async (room) => {
    try {
      const id = room._id || room.roomId || room.id;
      await roomService.updateRoomStatus(id, 'available');
      alert(`Đã đánh dấu phòng ${room.number || room.roomNumber} là "Sẵn sàng".`);
      // Xoá khỏi danh sách cần dọn
      setCleaningRooms(prev => prev.filter(r => (r._id || r.roomId || r.id) !== id));
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật trạng thái phòng.');
    }
  };

  // Gửi báo cáo bảo trì
  const handleSubmitReport = async () => {
    if (!selectedRoom || !reportText.trim()) {
      alert('Vui lòng nhập mô tả sự cố.');
      return;
    }
    try {
      await maintenanceService.reportIssue({
        roomId: selectedRoom._id || selectedRoom.roomId || selectedRoom.id,
        description: reportText.trim(),
        priority: 'Medium',
      });
      alert('Đã gửi báo cáo bảo trì.');
      setReportText('');
      setShowReportModal(false);
    } catch (err) {
      console.error(err);
      alert('Không thể gửi báo cáo bảo trì.');
    }
  };

  const roomsToShow = cleaningRooms; // đã là list từ API /rooms/cleaning

  return (
    <div className={styles.container}>
      <NavBar title="Housekeeping Dashboard" icon={Users} onLogout={onLogout} />

      <div className={styles.content}>
        {/* --------------------------------------------------- */}
        {/* 1. ROOM STATUS SUMMARY */}
        {/* --------------------------------------------------- */}
        <h2 className={styles.sectionTitle}>Tổng quan trạng thái phòng</h2>
        <div className={styles.grid}>
          {[
            { label: 'Cần dọn', count: stats.dirty, color: '#ef4444' },
            { label: 'Đang dọn', count: stats.cleaning, color: '#f97316' },
            { label: 'Sẵn sàng', count: stats.ready, color: '#22c55e' },
            { label: 'Đang bảo trì', count: stats.maintenance, color: '#eab308' },
            { label: 'Đang có khách', count: stats.occupied, color: '#3b82f6' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <h3 style={{ fontSize: '1rem', color: '#374151' }}>{item.label}</h3>
              <p
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: item.color,
                }}
              >
                {item.count}
              </p>
            </div>
          ))}
        </div>

        {/* --------------------------------------------------- */}
        {/* 2. TODAY CLEANING TASKS */}
        {/* --------------------------------------------------- */}
        <h2 className={styles.sectionTitle}>Danh sách phòng cần dọn hôm nay</h2>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : roomsToShow.length === 0 ? (
          <p>Hiện không có phòng nào cần dọn.</p>
        ) : (
          <div className={`${styles.grid} ${styles.gridRooms}`}>
            {roomsToShow.map((room) => {
              const rawStatus = (room.status || room.roomStatus || '').toString();
              const status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
              const statusKey = rawStatus.toLowerCase();
              const roomNumber = room.number || room.roomNumber || room.roomId || room._id;

              return (
                <div
                  key={room._id || room.roomId || room.id}
                  style={{
                    background: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    padding: '1.5rem',
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                        Phòng {roomNumber}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Tầng {room.floor || room.floorNumber || '-'}
                      </p>
                    </div>

                    <span
                      className={`
                        ${badgeStyles.badge}
                        ${statusKey === 'dirty' ? badgeStyles.warning : ''}
                        ${statusKey === 'cleaning' ? badgeStyles.occupied : ''}
                        ${statusKey === 'available' ? badgeStyles.success : ''}
                      `}
                    >
                      {status || 'Unknown'}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {statusKey === 'dirty' && (
                      <button
                        className={`${buttonStyles.base} ${buttonStyles.primary} ${buttonStyles.md}`}
                        onClick={() => handleStartCleaning(room)}
                      >
                        <Brush size={16} /> Bắt đầu dọn phòng
                      </button>
                    )}

                    {statusKey === 'cleaning' && (
                      <button
                        className={`${buttonStyles.base} ${buttonStyles.primary} ${buttonStyles.md}`}
                        onClick={() => handleFinishCleaning(room)}
                      >
                        <CheckCircle size={16} /> Hoàn tất dọn phòng
                      </button>
                    )}

                    <button
                      className={`${buttonStyles.base} ${buttonStyles.secondary} ${buttonStyles.md}`}
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowReportModal(true);
                      }}
                    >
                      <Wrench size={16} /> Báo lỗi bảo trì
                    </button>

                    <button
                      className={`${buttonStyles.base} ${buttonStyles.secondary} ${buttonStyles.md}`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <Eye size={16} /> Xem chi tiết phòng
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --------------------------------------------------- */}
      {/* 3. REPORT MAINTENANCE MODAL */}
      {/* --------------------------------------------------- */}
      {showReportModal && selectedRoom && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Báo cáo sự cố – Phòng {selectedRoom.number || selectedRoom.roomNumber}</h2>
            <textarea
              placeholder="Mô tả vấn đề..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              style={{
                width: '100%',
                minHeight: '80px',
                marginTop: '10px',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
              }}
            />
            <button
              className={`${buttonStyles.base} ${buttonStyles.primary} ${buttonStyles.md}`}
              style={{ marginTop: '1rem' }}
              onClick={handleSubmitReport}
            >
              Gửi báo cáo
            </button>

            <button
              className={`${buttonStyles.base} ${buttonStyles.secondary} ${buttonStyles.md}`}
              style={{ marginTop: '0.5rem' }}
              onClick={() => {
                setShowReportModal(false);
                setReportText('');
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* 4. ROOM DETAIL MODAL */}
      {/* --------------------------------------------------- */}
      {selectedRoom && !showReportModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Chi tiết phòng {selectedRoom.number || selectedRoom.roomNumber}</h2>
            <p>
              <b>Tầng:</b> {selectedRoom.floor || selectedRoom.floorNumber || '-'}
            </p>
            <p>
              <b>Loại phòng:</b> {selectedRoom.type || selectedRoom.roomTypeName || 'Không rõ'}
            </p>
            <p>
              <b>Trạng thái:</b> {selectedRoom.status || selectedRoom.roomStatus}
            </p>
            <p>
              <b>Ngày dọn gần nhất:</b> {selectedRoom.lastCleaned || 'N/A'}
            </p>

            <button
              className={`${buttonStyles.base} ${buttonStyles.secondary} ${buttonStyles.md}`}
              style={{ marginTop: '1rem' }}
              onClick={() => setSelectedRoom(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HousekeepingDashboard;
