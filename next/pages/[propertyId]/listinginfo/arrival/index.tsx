import React, { useState } from 'react';
import ListingLayout from '../layout';
import { useSelector } from 'react-redux';
import { PropertyRedux } from '../../../../../redux/slices/property/propertySlice';
import { PropertyDetailAPIResponseInterface } from '../../../../../redux/slices/property/interfaces/propertyDetail.interface';
import Title from '../../../../../components/property-details-layout/ListingInfo/components/UtilComponents/Title';
import SubHeading from '../../../../../components/property-details-layout/ListingInfo/components/UtilComponents/SubHeading';
import TextareawithLabel from '../../../../../components/property-details-layout/ListingInfo/components/UtilComponents/TextareawithLabel';
import SubTitle from '../../../../../components/property-details-layout/ListingInfo/components/UtilComponents/SubTitle';
import InputwithLabel from '../../../../../components/property-details-layout/ListingInfo/components/UtilComponents/InputwithLabel';
import SelectMenu from '../../../../../components/property-details-layout/ListingInfo/components/UtilComponents/SelectMenu';
import ReactMapGL from "react-map-gl";
import { useImmer } from 'use-immer';
import MapView from '../../../../../components/property-details-layout/ListingInfo/components/Arrival/components/MapView';
import Location from '../../../../../components/property-details-layout/ListingInfo/components/Arrival/components/Location';
import PublicTransport from '../../../../../components/property-details-layout/ListingInfo/components/Arrival/components/PublicTransport';
import AccessibilityFeatures from '../../../../../components/property-details-layout/ListingInfo/components/Arrival/components/AccessibilityFeatures';

const ArrivalIndexPage = ({ propertyId }) => {
  // Redux state selector
  const property: PropertyRedux = useSelector((state: any) => state.property);

  // Destructuring propertyDetail from property
  const { propertyDetail }: { propertyDetail: PropertyDetailAPIResponseInterface } = property;
  const publicTransport = ["Bus station", "Train station", "Local taxi stand", "Uber", "Others"];
  const [state, setState] = useImmer({
    location: propertyDetail.location || {},
    transportation: propertyDetail.transportation || { note: '', options: [] },
    accessibility: propertyDetail.accessibility || { note: '', options: [] },
  });
  // Handler for Location details change
  console.log("state:", state)
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    // Update Location in state
    setState((draft) => {
      draft.location[name] = value;
    });
  };

  const handleCheckboxChange = (event, category) => {
    const { value, checked } = event.target;
    // Update state based on checkbox checked status
    setState((draft) => {
      const categoryOptions = draft[category].options;
      if (checked) {
        draft[category].options = [...categoryOptions, value];
      } else {
        draft[category].options = categoryOptions.filter((item) => item !== value);
      }
    });
  };
  // Handler for general input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    // Update state based on input change
    setState((draft) => {
      draft.transportation[name] = value
    })
  }
  const accessibilityFeatures = [
    { name: "Accessible Route to Entrance", desc: "Pathway to the property's entrance is smooth and navigable." },
    { name: "Visual Fire Alarms", desc: "For guests with hearing impairments." },
    { name: "Wide Doorways", desc: "Doorways that are at least 32 inches wide for easy wheelchair access." },
    { name: "Elevator Access", desc: "Available for multi-story properties." },
  ];
  const accessToken = "pk.eyJ1IjoibmFpbTgyOCIsImEiOiJjbHYxMGp0OHcwMXUwMmp0MDBlNDVqZDkwIn0.DHlSEMr6E_XvX_ptrDeEeA"

  const [viewPort, setViewPort] = useState({
    latitude: Number(propertyDetail.location.lat) || 48.8583736,
    longitude: Number(propertyDetail.location.lng) || 2.291901,
    zoom: 12
  });
  const temptimeZones = Intl.supportedValuesOf('timeZone');
  const timeZones = temptimeZones.map((zone, index) => ({ id: index + 1, name: zone }));
  const [selectedTimeZone, setSelectedTimeZone] = useState(state.location.time_zone ? timeZones[timeZones.findIndex(zone => zone.name === state.location.time_zone)] : timeZones[0])


  return (
    <ListingLayout propertyId={propertyId}>

      <div className=" pt-4 mb-12 px-6">
        <section >
          <Title title={"Arrival & Direction"} stepsCompleted={7} totalSteps={8} toolTipText={"Lorem ipsum dolor sit amet consectetur. Nunc feugiat neque sodales adipiscing amet felis diam pellentesque odio. Non turpis sed venenatis et lacus non. Feugiat feugiat venenatis fermentum turpis nulla. Tellus porttitor potenti eleifend auctor eget tincidunt volutpat quis massa."} />
          <MapView viewPort={viewPort} accessToken={accessToken} />

          <Location state={state} handleLocationChange={handleLocationChange} timeZones={timeZones} selectedTimeZone={selectedTimeZone} setSelectedTimeZone={setSelectedTimeZone} />

          <PublicTransport state={state} handleCheckboxChange={handleCheckboxChange} handleInputChange={handleInputChange} publicTransport={publicTransport} />

          <AccessibilityFeatures state={state} accessibilityFeatures={accessibilityFeatures} handleCheckboxChange={handleCheckboxChange} />

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

export default ArrivalIndexPage;