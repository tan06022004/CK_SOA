import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, User, Bed, DollarSign } from 'lucide-react';
import { mockBookings } from '../../data/mockData';
import styles from '../../styles/Table.module.css';
import buttonStyles from '../../styles/Button.module.css';
import badgeStyles from '../../styles/Badge.module.css';

const BookingsTab = () => {
  const [showModal, setShowModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customer: '',
    room: '',
    checkIn: '',
    checkOut: '',
    total: '',
    status: 'Pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking created:', newBooking);
    alert('Đặt phòng thành công!');
    setShowModal(false);
    setNewBooking({
      customer: '',
      room: '',
      checkIn: '',
      checkOut: '',
      total: '',
      status: 'Pending'
    });
  };

  return (
    <div>
      {/* Header + Add Button */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Calendar size={24} />
          Quản lý đặt phòng
        </h2>
        <button 
          onClick={() => setShowModal(true)}
          className={buttonStyles.primary}
        >
          <Plus size={24} />
          Đặt phòng mới
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th><Calendar size={16} /> Mã</th>
              <th><User size={16} /> Khách</th>
              <th><Bed size={16} /> Phòng</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Trạng thái</th>
              <th><DollarSign size={16} /> Tổng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {mockBookings.map(booking => (
              <tr key={booking.id} className={styles.row}>
                <td className={styles.id}>#{booking.id}</td>
                <td className={styles.customer}>{booking.customer}</td>
                <td className={styles.room}>{booking.room}</td>
                <td className={styles.date}>{booking.checkIn}</td>
                <td className={styles.date}>{booking.checkOut}</td>
                <td>
                  <span className={`${badgeStyles.badge} ${
                    booking.status === 'Confirmed' 
                      ? badgeStyles.info 
                      : booking.status === 'Checked In'
                      ? badgeStyles.success
                      : badgeStyles.warning
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className={styles.price}>${booking.total}</td>
                <td className={styles.actions}>
                  <button className={styles.editBtn} title="Sửa">
                    <Edit size={16} />
                  </button>
                  <button className={styles.deleteBtn} title="Xóa">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Form Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Đặt phòng mới</h3>

            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.formGrid}>
                <div>
                  <label>Tên khách hàng</label>
                  <input 
                    type="text" 
                    name="customer" 
                    value={newBooking.customer} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                  <label>Phòng</label>
                  <input 
                    type="text" 
                    name="room" 
                    value={newBooking.room} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                  <label>Ngày check-in</label>
                  <input 
                    type="date" 
                    name="checkIn" 
                    value={newBooking.checkIn} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                  <label>Ngày check-out</label>
                  <input 
                    type="date" 
                    name="checkOut" 
                    value={newBooking.checkOut} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                  <label>Tổng tiền ($)</label>
                  <input 
                    type="number" 
                    name="total" 
                    value={newBooking.total} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                  <label>Trạng thái</label>
                  <select 
                    name="status" 
                    value={newBooking.status} 
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Checked In">Checked In</option>
                    <option value="Checked Out">Checked Out</option>
                  </select>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={buttonStyles.primary}>Lưu</button>
                <button 
                  type="button" 
                  className={buttonStyles.secondary} 
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
