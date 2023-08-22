import { useEffect } from "react";
import NavigationBarAdmin from '../../components/nav-admin.component';

function UsersActivity() {
    useEffect(() => {
        document.title = 'Activities | Swerte Saya';
      }, []);
    
      return <>
        <div style={{ background: '#f9f9f9', height: '100vh' }}>
          <NavigationBarAdmin />
          <div style={{ marginTop: '20px', marginLeft: '70px', marginRight: '70px' }}>
          </div>
          <div style={{ marginTop: '20px', marginLeft: '70px', marginRight: '70px' }}>
          </div>
        </div>
      </>
}

export default UsersActivity