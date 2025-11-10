import React from 'react';
import RoomCard from '../RoomCard';
import { mockRooms } from '../../data/mockData';
import styles from '../../styles/Dashboard.module.css';

const RoomsTab = () => (
  <div>
    <h2 className={styles.sectionTitle}>
      Trạng thái phòng
    </h2>
    <div className={`${styles.grid} ${styles.gridRooms}`}>
      {mockRooms.map((room) => (
        <div key={room.id} className={styles.gridItem}>
          <RoomCard room={room} />
        </div>
      ))}
    </div>
  </div>
);

export default RoomsTab;