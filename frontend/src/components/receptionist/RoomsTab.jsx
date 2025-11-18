import React, { useEffect, useState } from 'react';
import RoomCard from '../RoomCard';
import { useRooms } from '../../hooks/useRooms';
import styles from '../../styles/Dashboard.module.css';

const RoomsTab = () => {
  const { rooms, isLoading, error } = useRooms();
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (rooms) {
      if (statusFilter === 'all') {
        setFilteredRooms(rooms);
      } else {
        setFilteredRooms(rooms.filter(room => room.status === statusFilter));
      }
    }
  }, [rooms, statusFilter]);

  if (isLoading) {
    return <div>Đang tải phòng...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  // Transform backend room data to match RoomCard component format
  const transformRoom = (room) => ({
    id: room._id,
    number: room.roomNumber,
    floor: room.floor,
    type: room.roomType?.typeName || 'N/A',
    status: room.status === 'available' ? 'Available' :
            room.status === 'occupied' ? 'Occupied' :
            room.status === 'dirty' ? 'Dirty' :
            room.status === 'cleaning' ? 'Cleaning' :
            room.status === 'maintenance' ? 'Maintenance' : room.status,
    price: room.roomType?.basePrice || 0,
    roomData: room // Keep original data for reference
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className={styles.sectionTitle}>Trạng thái phòng</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db',
            fontSize: '0.875rem'
          }}
        >
          <option value="all">Tất cả</option>
          <option value="available">Trống</option>
          <option value="occupied">Đã thuê</option>
          <option value="dirty">Cần dọn</option>
          <option value="cleaning">Đang dọn</option>
          <option value="maintenance">Bảo trì</option>
        </select>
      </div>
      {filteredRooms.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          Không có phòng nào
        </div>
      ) : (
        <div className={`${styles.grid} ${styles.gridRooms}`}>
          {filteredRooms.map((room) => (
            <div key={room._id} className={styles.gridItem}>
              <RoomCard room={transformRoom(room)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsTab;
