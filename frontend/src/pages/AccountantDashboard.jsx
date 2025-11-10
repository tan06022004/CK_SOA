import React from 'react';
import { DollarSign, FileText, CreditCard, Eye } from 'lucide-react';
import NavBar from '../components/NavBar';
import StatCard from '../components/StatCard';
import styles from '../styles/Dashboard.module.css';
import tableStyles from '../styles/Table.module.css';
import badgeStyles from '../styles/Badge.module.css';

const AccountantDashboard = ({ onLogout }) => {
  return (
    <div className={styles.container}>
      <NavBar title="Kế toán" icon={DollarSign} onLogout={onLogout} />
      <div className={styles.content}>
        <div className={`${styles.grid} ${styles.grid3}`}>
          <StatCard title="Doanh thu hôm nay" value="$2,450" icon={DollarSign} iconColor="text-green-600" />
          <StatCard title="Doanh thu tháng này" value="$45,680" icon={FileText} iconColor="text-blue-600" />
          <StatCard title="Hóa đơn chưa thanh toán" value="12" icon={CreditCard} iconColor="text-red-600" />
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
                <tr>
                  <td className={tableStyles.td}>#INV001</td>
                  <td className={tableStyles.td}>Nguyen Van A</td>
                  <td className={tableStyles.td}>2025-11-09</td>
                  <td className={tableStyles.td}>$750</td>
                  <td className={tableStyles.td}>
                    <span className={`${badgeStyles.badge} ${badgeStyles.success}`}>Đã thanh toán</span>
                  </td>
                  <td className={tableStyles.td}>
                    <button className={tableStyles.actionBtn}><Eye size={18} /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;