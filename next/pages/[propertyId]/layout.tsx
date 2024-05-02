// Layout.tsx
import React, { useEffect  } from 'react';
import {useSelector} from 'react-redux'
import { useRouter } from 'next/router';

const Layout = ({ children, propertyId }) => {
  const router = useRouter();
  const property = useSelector((state:any) => state.property);
  //if we dont have the property data in redux or if the property in redux is not the same as the property we fetched

  useEffect(() => {
    if (!property.property_id ) {
      // window.location.href = `/details/${propertyId}`
      router.push(`/details/${propertyId}`);
    }

    return () => {
      
    }
  }, [router.isReady])
  
  if (property?.loader) {
    return (
      <>Loading...</>
    )
  } else if (!property?.property_id ) {
    return (
      null
    )
  } else {
    return (
      <div className='flex flex-row'>       
        {children}
      </div>
    );
  }

  
};

export default Layout;

