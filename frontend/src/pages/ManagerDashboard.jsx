import React, { useState } from 'react';
import { UserCheck, Bed, Users, DollarSign, Calendar, CheckCircle, X } from 'lucide-react';
import NavBar from '../components/NavBar';
import StatCard from '../components/StatCard';
import styles from '../styles/Dashboard.module.css';

const ManagerDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('report'); // mặc định tab xem báo cáo

  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: '',
    sdt: '',
    namSinh: '',
    role: 'Nhân viên'
  });

  // Dữ liệu ví dụ thống kê nhân viên (cho tab nhân viên)
  const employeeStats = [
    { title: 'Tổng nhân viên', value: 0, bgColor: '#e9d5ff', icon: <Users size={24} color="#7c3aed" /> },
    { title: 'Quản trị viên', value: 0, bgColor: '#fee2e2', icon: <UserCheck size={24} color="#dc2626" /> },
    { title: 'Nhân viên', value: 0, bgColor: '#dbeafe', icon: <UserCheck size={24} color="#2563eb" /> },
    { title: 'Đang hoạt động', value: 0, bgColor: '#dcfce7', icon: <CheckCircle size={24} color="#22c55e" /> },
  ];

  // Xử lý mở/đóng modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ hoTen: '', sdt: '', namSinh: '', role: 'Nhân viên' });
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý lưu (chỉ đóng modal, có thể mở rộng sau)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nhân viên mới:', formData);
    closeModal();
    // Có thể gọi API hoặc cập nhật danh sách ở đây
  };

  return (
    <div className={styles.container}>
      <NavBar title="Quản lý" icon={UserCheck} onLogout={onLogout} />

      <div className={styles.content}>
        {/* Tabs chuyển đổi */}
        <div className={styles.tabs}>
          <div
            className={`${styles.tab} ${activeTab === 'report' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('report')}
          >
            Xem Báo Cáo
          </div>
          <div
            className={`${styles.tab} ${activeTab === 'staff' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            Quản Lý Nhân Viên
          </div>

          {/* Nút thêm nhân viên chỉ hiện khi tab active là staff */}
          {activeTab === 'staff' && (
            <button className={styles.addEmployeeButton} onClick={openModal}>
              + Thêm nhân viên
            </button>
          )}
        </div>

        {/* Nội dung từng tab */}
        {activeTab === 'report' && (
          <>
            <h2 className={styles.sectionTitle}>Tổng quan hệ thống</h2>
            <div className={`${styles.grid} ${styles.grid4}`}>
              <StatCard title="Tổng phòng" value="48" icon={Bed} iconColor="text-blue-600" />
              <StatCard title="Phòng đang sử dụng" value="32" icon={Users} iconColor="text-green-600" />
              <StatCard title="Doanh thu tháng" value="$125K" icon={DollarSign} iconColor="text-green-600" />
              <StatCard title="Tỷ lệ lấp đầy" value="67%" icon={Calendar} iconColor="text-purple-600" />
            </div>

            <div className={`${styles.grid}`} style={{ gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Báo cáo doanh thu</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Phòng Standard', value: '$35,000', percent: 45 },
                    { label: 'Phòng Deluxe', value: '$55,000', percent: 70 },
                    { label: 'Phòng Suite', value: '$35,000', percent: 45 },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.label}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>{item.value}</span>
                      </div>
                      <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '9999px', height: '0.5rem' }}>
                        <div
                          style={{
                            width: `${item.percent}%`,
                            background:
                              item.percent > 60 ? '#22c55e' : item.percent > 40 ? '#3b82f6' : '#a855f7',
                            height: '100%',
                            borderRadius: '9999px',
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Hoạt động gần đây</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ background: '#d1fae5', borderRadius: '50%', padding: '0.5rem', marginRight: '0.75rem' }}>
                      <CheckCircle className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1f2937' }}>Check-in mới</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Nguyen Van A - Phòng 101</p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>5 phút trước</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'staff' && (
          <>
            <h2>Quản lý Nhân sự</h2>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {employeeStats.map(({ title, value, bgColor, icon }) => (
                <div key={title} style={{ backgroundColor: 'white', flex: 1, padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: bgColor, borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{value}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{title}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Các tab con danh sách nhân viên, chấm công, bảng lương */}
            <div style={{ marginTop: '1.5rem' }}>
              {/* Giả sử chỉ demo tab "Danh sách nhân viên" */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #7c3aed', paddingBottom: '0.5rem', fontWeight: 600, color: '#7c3aed' }}>
                Danh sách nhân viên
              </div>

              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                style={{
                  width: '250px',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  marginBottom: '1rem',
                }}
              />

              <select
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  marginLeft: '1rem',
                }}
              >
                <option>Tất cả vai trò</option>
                <option>Quản trị viên</option>
                <option>Nhân viên</option>
              </select>

              {/* Bảng danh sách nhân viên rỗng */}
              <div style={{ marginTop: '2rem', textAlign: 'center', color: '#6b7280' }}>
                <p>Chưa có nhân viên nào</p>
                <p>Hãy thêm nhân viên đầu tiên</p>
              </div>
            </div>
          </>
        )}

        {/* Modal Thêm Nhân Viên */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }} onClick={closeModal}>
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937' }}>
                  Thêm nhân viên mới
                </h3>
                <button
                  onClick={closeModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '0.375rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X size={20} color="#6b7280" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                      Họ và tên <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="hoTen"
                      value={formData.hoTen}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        fontSize: '0.875rem'
                      }}
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                      Số điện thoại <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="sdt"
                      value={formData.sdt}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{10}"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        fontSize: '0.875rem'
                      }}
                      placeholder="Ví dụ: 0901234567"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                      Năm sinh <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="namSinh"
                      value={formData.namSinh}
                      onChange={handleInputChange}
                      required
                      min="1950"
                      max="2010"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        fontSize: '0.875rem'
                      }}
                      placeholder="Ví dụ: 1995"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                      Vai trò <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="Nhân viên">Nhân viên</option>
                      <option value="Quản trị viên">Quản trị viên</option>
                    </select>
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db',
                      background: 'white',
                      color: '#374151',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      background: '#7c3aed',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6d28d9'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#7c3aed'}
                  >
                    Lưu nhân viên
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;