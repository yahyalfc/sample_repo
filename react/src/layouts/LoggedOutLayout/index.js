import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from "../../components/Footer"
import LoggedOutNavbar from './layout_components/LoggedOutNavbar';

const LoggedOutLayout = () => {
  // on basis of props we will differentiate between what to render in 
  const [] = useState('loggedOut')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', overflowX: 'auto', overflowY: 'hidden', marginTop: 50 }} >
      <LoggedOutNavbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default LoggedOutLayout;
