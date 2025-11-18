import React, { useEffect, useState } from 'react';
import { DollarSign, FileText, CreditCard, Eye } from 'lucide-react';
import NavBar from '../components/NavBar';
import StatCard from '../components/StatCard';
import styles from '../styles/Dashboard.module.css';
import tableStyles from '../styles/Table.module.css';
import badgeStyles from '../styles/Badge.module.css';
import { apiCall } from '../config/api';
import invoiceService from '../services/invoiceService';

const AccountantDashboard = ({ onLogout }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAllInvoices();
      setInvoices(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('Failed to load invoices', err);
      alert('Không thể tải hóa đơn.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInvoices(); }, []);

  const totalToday = invoices.reduce((sum, inv) => {
    // quick heuristic: if issueDate is today
    try {
      const d = new Date(inv.issueDate || inv.createdAt);
      const now = new Date();
      if (d.toDateString() === now.toDateString()) return sum + (inv.totalAmount || 0);
    } catch (e) {}
    return sum;
  }, 0);

  const totalMonth = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const unpaidCount = invoices.filter(inv => (inv.paymentStatus || '').toLowerCase() !== 'paid').length;

  return (
    <div className={styles.container}>
      <NavBar title="Kế toán" icon={DollarSign} onLogout={onLogout} />
      <div className={styles.content}>
        <div className={`${styles.grid} ${styles.grid3}`}>
          <StatCard title="Doanh thu hôm nay" value={`₫${totalToday.toLocaleString()}`} icon={DollarSign} iconColor="text-green-600" />
          <StatCard title="Doanh thu (tổng)" value={`₫${totalMonth.toLocaleString()}`} icon={FileText} iconColor="text-blue-600" />
          <StatCard title="Hóa đơn chưa thanh toán" value={String(unpaidCount)} icon={CreditCard} iconColor="text-red-600" />
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2 className={styles.sectionTitle}>Hóa đơn gần đây</h2>
          <div className={tableStyles.tableContainer}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th className={tableStyles.th}>Mã HĐ</th>
                  <th className={tableStyles.th}>Khách hàng</th>
                  <th className={tableStyles.th}>Ngày lập</th>
                  <th className={tableStyles.th}>Tổng tiền</th>
                  <th className={tableStyles.th}>Trạng thái</th>
                  <th className={tableStyles.th}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className={tableStyles.td} colSpan={6}>Đang tải...</td></tr>
                ) : invoices.length === 0 ? (
                  <tr><td className={tableStyles.td} colSpan={6}>Không có hóa đơn</td></tr>
                ) : (
                  invoices.slice(0, 20).map(inv => (
                    <tr key={inv._id}>
                      <td className={tableStyles.td}>#{inv._id?.slice(-6)}</td>
                      <td className={tableStyles.td}>{inv.booking?.guest?.fullName || inv.booking?.guest?.name || (inv.booking?.guest?.fullName) || 'Khách'}</td>
                      <td className={tableStyles.td}>{new Date(inv.issueDate || inv.createdAt).toLocaleDateString()}</td>
                      <td className={tableStyles.td}>₫{Number(inv.totalAmount || 0).toLocaleString()}</td>
                      <td className={tableStyles.td}>
                        <span className={`${badgeStyles.badge} ${(inv.paymentStatus || '').toLowerCase() === 'paid' ? badgeStyles.success : ''}`}>{inv.paymentStatus || 'pending'}</span>
                      </td>
                      <td className={tableStyles.td}>
                        <button className={tableStyles.actionBtn}><Eye size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;