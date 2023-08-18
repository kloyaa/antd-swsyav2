import { useEffect } from 'react';
import NavigationBarAdmin from '../components/nav-admin.component';
import TransactionTable from '../components/table-transactions.component';
import Statistics from '../components/stats.component';

function AdminDashboard() {
  useEffect(() => {
    document.title = 'Dashboard | Swerte Saya';
  }, []);
  return (
    <div style={{ background: '#f9f9f9', height: '100vh' }}>
      <NavigationBarAdmin />
      <div style={{ marginTop: '20px', marginLeft: '20px', marginRight: '20px' }}>
        <Statistics />
      </div>
      <div style={{ marginTop: '20px', marginLeft: '20px', marginRight: '20px' }}>
        <TransactionTable />
      </div>
    </div>
  );
}

export default AdminDashboard;
