import { Outlet } from 'react-router-dom';
import ProfileNavbar from '../layout_components/ProfileNavbar'

const SupplierLayout = () => {
  return (
    <div>
      <ProfileNavbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default SupplierLayout;