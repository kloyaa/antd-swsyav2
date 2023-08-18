import { useEffect } from 'react';
import NavigationBarAdmin from '../components/nav-admin.component';

function AdminDashboard() {
  useEffect(() => {
    document.title = 'Dashboard | Swerte Saya';
  }, []);
  return (
    <div style={{ background: '#f9f9f9', height: '100vh' }}>
      <NavigationBarAdmin />
    </div>
  );
}

export default AdminDashboard;
