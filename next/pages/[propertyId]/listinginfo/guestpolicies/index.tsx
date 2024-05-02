import React from 'react';
import ListingLayout from '../layout';
import { useSelector } from 'react-redux';
import GuestPolicies from '../../../../../components/property-details-layout/ListingInfo/components/GuestPolicies';
import { PropertyRedux } from '../../../../../redux/slices/property/propertySlice';
import { PropertyDetailAPIResponseInterface } from '../../../../../redux/slices/property/interfaces/propertyDetail.interface';


const GuestPoliciesIndexPage = ({propertyId}) => {
  // Redux state selector
  const property: PropertyRedux = useSelector((state: any) => state.property);

  // Destructuring propertyDetail from property
  const { propertyDetail }: { propertyDetail: PropertyDetailAPIResponseInterface } = property;
  return (
    <ListingLayout propertyId={propertyId}>
      <GuestPolicies propertyDetail={propertyDetail}/>
    </ListingLayout>
  );
};

export async function getServerSideProps({ params }) {
  const { propertyId } = params;
  // Fetch data based on propertyId if needed

  return {
    props: {
      propertyId,
    },
  };
}

export default GuestPoliciesIndexPage;