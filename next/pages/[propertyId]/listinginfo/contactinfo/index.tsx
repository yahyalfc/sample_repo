import React from 'react';
import ListingLayout from '../layout';
import { useSelector } from 'react-redux';
import { PropertyRedux } from '../../../../../redux/slices/property/propertySlice';
import { PropertyDetailAPIResponseInterface } from '../../../../../redux/slices/property/interfaces/propertyDetail.interface';
import Title from '../../../../../components/property-details-layout/ListingInfo/components/UtilComponents/Title';
import PersonalConatcts from '../../../../../components/property-details-layout/ListingInfo/components/ContactInfo/PersonalContact';
import { useImmer } from 'use-immer';
import EmergencyConatcts from '../../../../../components/property-details-layout/ListingInfo/components/ContactInfo/EmergencyContact';


const ContactInfoIndexPage = ({ propertyId }) => {
  // Redux state selector
  const property: PropertyRedux = useSelector((state: any) => state.property);

  // Destructuring propertyDetail from property
  const { propertyDetail }: { propertyDetail: PropertyDetailAPIResponseInterface } = property;
  const [state, setState] = useImmer({
    contacts: propertyDetail.contacts || {},
  });

  const handleContactsChange = (e, category) => {
    const { name, value } = e.target;
    // Update contacts in state
    setState((draft) => {
      draft.contacts[category][name] = value;
    });
  };
  return (
    <ListingLayout propertyId={propertyId}>

      <div className=" pt-4 mb-12 px-6">

        <section>
          <Title title={"Contact Information"} stepsCompleted={8} totalSteps={8} toolTipText={"Lorem ipsum dolor sit amet consectetur. Nunc feugiat neque sodales adipiscing amet felis diam pellentesque odio. Non turpis sed venenatis et lacus non. Feugiat feugiat venenatis fermentum turpis nulla. Tellus porttitor potenti eleifend auctor eget tincidunt volutpat quis massa."} />

          <PersonalConatcts state={state} handleContactsChange={handleContactsChange} />

          <EmergencyConatcts state={state} handleContactsChange={handleContactsChange} />
        
        </section>

      </div>

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

export default ContactInfoIndexPage;