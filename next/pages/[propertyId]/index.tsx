
import React, { useState, useEffect } from 'react';
import Layout from './layout';
import {useDispatch} from "react-redux"
import {setPropertyLoadingReducer, setPropertyDetailsReducer,  setPropertyDataReducer, setUnitTypeReducer, setUnitsReducer } from "../../../redux/slices/property/propertySlice"
import { toast } from "react-toastify";
import { useRouter } from 'next/router';

/**
 * This is the main component of the property details. Here we will fetch the data and set to redux.
 * If any of the sub routes or the main layout file dont have the data in redux we will fetch the data here and redirect user to the first sub route. 
 * 
 * Redux should also have a loader so we can show loader on the whole page. And here in this component we will also show that loader
 * 
 * @param propertyId - passed in the path parameter of the query 
 * @returns 
 */

const DetailsPage = ({ propertyId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  //function to fetch the property data
  const fetchPropertyData = async (propertyId:any) => {
    try {    
    //lets fetch the property data
    const res = await fetch("/api/get-property-by-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: propertyId }),
    })
    const response = await res?.json()

    if (!response) {
      throw new Error("No response received");
    }

      const { data, error } = response; //extracting data

      if (error) {
        throw new Error(error);
      }
      return data
    } catch (error) {
      console.log('property details screen - property error', error);
      throw new Error(`Error fetching the property`);
    }
  };

  
  
  useEffect(() => {
    // Fetch property data based on propertyId
    // You can use fetch or any other data fetching library
    const fetchData = async () => {      
      try {
        //here we set the loader in redux true
        dispatch(setPropertyLoadingReducer({propertyId, data: {loader: true}}))
        // we fetch data from our database
        const propertyData = await fetchPropertyData(propertyId);
        // console.log("property fetched from api. data: ",propertyData)
        const {property_data, zeevou_unit_types, ...property} = propertyData;
        //here we will dispatch property data in redux
        dispatch(setPropertyDetailsReducer({propertyId, data: property_data}))
        //here we set the property data
        dispatch(setPropertyDataReducer({propertyId, data: property}))
        //for special case of zeevou
        if (property.platform == 'zeevou'){
          //now we will set the unit types
          dispatch(setUnitTypeReducer({propertyId, data: zeevou_unit_types}))
        }
        //after the data is fetched we will turn off the loader
        dispatch(setPropertyLoadingReducer({propertyId, data: {loader: false}}))
        //redirect the user to the activity screen
        router.push(`/details/${propertyId}/listinginfo`);
      } catch (error) {
        dispatch(setPropertyLoadingReducer({propertyId, data: {loader: false}}))
        // Handle the error here
        console.error("Error fetching property data:");
        console.log({error});
        
        toast.error("Error fetching the property. Please try again later", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          toastId: propertyId
        });
        // router.push(`/dashboard`);
      }
    };

    fetchData();
  }, [propertyId]);

  return (
    <Layout propertyId={propertyId}>
      <div>
        {/** We dont render here anything - after fetching the data we will re-route to /details/{propertyId}/activity */}
      </div>
    </Layout>
  );
};

DetailsPage.getInitialProps = async ({ query }) => {
  const { propertyId } = query;
  return { propertyId };
};

export default DetailsPage;