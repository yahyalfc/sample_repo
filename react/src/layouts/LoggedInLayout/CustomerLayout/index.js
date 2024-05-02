import { Outlet } from 'react-router-dom';
import ProfileNavbar from '../layout_components/ProfileNavbar'

const CustomerLayout = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <ProfileNavbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerLayout;
