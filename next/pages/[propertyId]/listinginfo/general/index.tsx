import React from 'react';
import ListingLayout from '../layout';
import { useSelector } from 'react-redux';
import Title from '../../../../../components/property-details-layout/ListingInfo/components/UtilComponents/Title';
import InputwithLabel from '../../../../../components/property-details-layout/ListingInfo/components/UtilComponents/InputwithLabel';
import { useImmer } from 'use-immer';
import { PropertyDetailAPIResponseInterface } from '../../../../../redux/slices/property/interfaces/propertyDetail.interface';
import { PropertyRedux } from '../../../../../redux/slices/property/propertySlice';
import PropertyDescription from '../../../../../components/property-details-layout/ListingInfo/components/General/components/PropertyDescription';
import Accommodation from '../../../../../components/property-details-layout/ListingInfo/components/General/components/Accomodation';
import Rooms from '../../../../../components/property-details-layout/ListingInfo/components/General/components/Rooms';
import Amenities from '../../../../../components/property-details-layout/ListingInfo/components/General/components/Amenities';
import WifiDetails from '../../../../../components/property-details-layout/ListingInfo/components/General/components/WifiDetails';

const GeneralIndexPage = ({ propertyId }) => {
  // Redux state selector
  const property: PropertyRedux = useSelector((state: any) => state.property);

  // Destructuring propertyDetail from property
  const { propertyDetail }: { propertyDetail: PropertyDetailAPIResponseInterface } = property;
  console.log("propertyDetail:", propertyDetail)

  // Initialize selectedAmenities with propertyDetail.amenities or an empty array
  const selectedAmenities = propertyDetail.amenities || []

  // State management using useImmer hook
  const [state, setState] = useImmer({
    property_description: propertyDetail.property_description || '',
    amenities: propertyDetail.amenities || [],
    accomodation: propertyDetail.accommodation,
    integration_type: propertyDetail.integration_type,
    wifi_details: propertyDetail.wifi_details,
    guide_book_url: propertyDetail.guide_book_url,
    rooms: propertyDetail.accommodation.rooms && JSON.parse(propertyDetail.accommodation.rooms)
  });

  // Handler for amenity checkbox change
  const handleAmenityChange = (event) => {
    const { value, checked } = event.target;
    // Update state based on checkbox checked status
    if (checked) {
      setState((draft) => {
        draft.amenities = [...draft.amenities, value]
      })
    } else {
      setState((draft) => {
        draft.amenities = draft.amenities.filter((amenity) => amenity !== value)
      })
    }
  };

  // Handler for WiFi details change
  const handleWifiChange = (e) => {
    const { name, value } = e.target;
    // Update WiFi details in state
    setState((draft) => {
      draft.wifi_details[name] = value;
    });
  };
  // Handler for general input change
 const handleInputChange = (e) => {
    const { name, value } = e.target
    // Update state based on input change
    setState((draft) => {
      draft[name] = value
    })
  }
  return (
    <ListingLayout propertyId={propertyId}>
      <div className=" pt-4 pb-2 mb-8 px-6">
        <section >

          <Title title={"General Information"} stepsCompleted={3} totalSteps={6} toolTipText={"Lorem ipsum dolor sit amet consectetur. Nunc feugiat neque sodales adipiscing amet felis diam pellentesque odio. Non turpis sed venenatis et lacus non. Feugiat feugiat venenatis fermentum turpis nulla. Tellus porttitor potenti eleifend auctor eget tincidunt volutpat quis massa."} />

          <PropertyDescription state={state} handleDescriptionChange={handleInputChange} />

          <Accommodation state={state} />

          <Rooms state={state} propertyDetail={propertyDetail} />

          <Amenities state={state} selectedAmenities={selectedAmenities} handleAmenityChange={handleAmenityChange} />

          <WifiDetails state={state} handleWifiChange={handleWifiChange} integration_type={propertyDetail.integration_type} />

          <InputwithLabel placeholder={'https://www.goole.com'} name={"guide_book_url"} value={state.guide_book_url} onChange={handleInputChange} title={'Guidebook URL'} />

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

export default GeneralIndexPage;