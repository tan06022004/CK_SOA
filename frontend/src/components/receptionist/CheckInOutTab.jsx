import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { useBookings } from '../../hooks/useBookings';
import styles from '../../styles/Dashboard.module.css';
import buttonStyles from '../../styles/Button.module.css';

const CheckInOutTab = () => {
  const { bookings, refetch } = useBookings();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Filter bookings for check-in today (confirmed status)
  const checkInsToday = bookings.filter(booking => {
    const checkInDate = new Date(booking.checkInDate).toISOString().split('T')[0];
    return checkInDate === today && booking.status === 'confirmed';
  });

  // Filter bookings for check-out today (checked_in status)
  const checkOutsToday = bookings.filter(booking => {
    const checkOutDate = new Date(booking.checkOutDate).toISOString().split('T')[0];
    return checkOutDate === today && booking.status === 'checked_in';
  });

  const handleCheckIn = async (bookingId) => {
    if (window.confirm('Xác nhận check-in cho đặt phòng này?')) {
      setIsProcessing(true);
      try {
        await bookingService.checkIn(bookingId);
        alert('Check-in thành công!');
        refetch();
      } catch (err) {
        alert('Lỗi: ' + (err.message || 'Không thể check-in'));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCheckOut = async (bookingId) => {
    if (window.confirm('Xác nhận check-out cho đặt phòng này?')) {
      setIsProcessing(true);
      try {
        const result = await bookingService.checkOut(bookingId);
        alert('Check-out thành công! Hóa đơn đã được tạo.');
        refetch();
      } catch (err) {
        alert('Lỗi: ' + (err.message || 'Không thể check-out'));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div>
      <h2 className={styles.sectionTitle}>Check-in & Check-out</h2>
      <div className={styles.grid} style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <CheckCircle className="text-green-600" size={24} style={{ marginRight: '0.5rem' }} /> 
            Check-in hôm nay ({checkInsToday.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {checkInsToday.length === 0 ? (
              <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Không có đặt phòng nào cần check-in hôm nay</p>
            ) : (
              checkInsToday.map(booking => (
                <div key={booking._id} style={{ borderLeft: '4px solid #22c55e', paddingLeft: '1rem' }}>
                  <p style={{ fontWeight: 500, color: '#1f2937' }}>
                    {booking.guest?.fullName || 'N/A'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Phòng {booking.room?.roomNumber || 'N/A'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Check-in: {new Date(booking.checkInDate).toLocaleDateString('vi-VN')} - 
                    Check-out: {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                  </p>
                  <button
                    className={`${buttonStyles.primary} ${buttonStyles.sm}`}
                    style={{ marginTop: '0.5rem' }}
                    onClick={() => handleCheckIn(booking._id)}
                    disabled={isProcessing}
                  >
                    Check-in
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <XCircle className="text-red-600" size={24} style={{ marginRight: '0.5rem' }} /> 
            Check-out hôm nay ({checkOutsToday.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {checkOutsToday.length === 0 ? (
              <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Không có đặt phòng nào cần check-out hôm nay</p>
            ) : (
              checkOutsToday.map(booking => (
                <div key={booking._id} style={{ borderLeft: '4px solid #ef4444', paddingLeft: '1rem' }}>
                  <p style={{ fontWeight: 500, color: '#1f2937' }}>
                    {booking.guest?.fullName || 'N/A'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Phòng {booking.room?.roomNumber || 'N/A'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Check-in: {new Date(booking.checkInDate).toLocaleDateString('vi-VN')} - 
                    Check-out: {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                  </p>
                  <button
                    className={`${buttonStyles.primary} ${buttonStyles.sm}`}
                    style={{ marginTop: '0.5rem', background: '#dc2626' }}
                    onClick={() => handleCheckOut(booking._id)}
                    disabled={isProcessing}
                  >
                    Check-out
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInOutTab;
