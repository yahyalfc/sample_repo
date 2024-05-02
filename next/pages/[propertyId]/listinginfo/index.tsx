import React, { useEffect, useState } from 'react';
import Layout from '../layout';
import ListingLayout from './layout';
import { useRouter } from 'next/router';
import PropertyMain from '../../../../components/property-details-layout/ListingInfo/components/PropertyMain';
import { useSelector } from 'react-redux';
const ListinginfoIndexPage = ({ childern, propertyId }) => {
  const property = useSelector((state: any) => state.property);
  const router = useRouter();

  const [currentCard, setCurrentCard] = useState("Main")
  //if we dont have the property data in redux or if the property in redux is not the same as the property we fetched
  const PropertyCards = [
    {
      title: "General Information",
      href:`/details/${propertyId}/listinginfo/general`,
      desc: "Things like wifi, parking, and more",
      totalSteps: 8,
      stepsCompleted: 8,
      icon: () => (
        <svg width="59" height="58" viewBox="0 0 59 58" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="58" height="57" rx="28.5" stroke="#619C8D" />
          <path d="M29.668 23.6667V29M29.668 34.3333H29.6813M41.668 29C41.668 35.6274 36.2954 41 29.668 41C23.0406 41 17.668 35.6274 17.668 29C17.668 22.3726 23.0406 17 29.668 17C36.2954 17 41.668 22.3726 41.668 29Z" stroke="#619C8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: "Reservation",
      desc: "Lorem ipsum dolor sit amet consectetur.",
      href:`/details/${propertyId}/listinginfo/reservation`,
      totalSteps: 7,
      stepsCompleted: 5,
      icon: () => (
        <svg width="60" height="58" viewBox="0 0 60 58" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.16602" y="0.5" width="58" height="57" rx="28.5" stroke="#619C8D" />
          <path d="M30.666 23.6667V29L34.666 33M42.666 29C42.666 35.6274 37.2934 41 30.666 41C24.0386 41 18.666 35.6274 18.666 29C18.666 22.3726 24.0386 17 30.666 17C37.2934 17 42.666 22.3726 42.666 29Z" stroke="#619C8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: "Parking",
      desc: "Lorem ipsum dolor sit amet consectetur.",
      href:`/details/${propertyId}/listinginfo/parking`,
      totalSteps: 10,
      stepsCompleted: 2,
      icon: () => (
        <svg width="60" height="58" viewBox="0 0 60 58" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.833984" y="0.5" width="58" height="57" rx="28.5" stroke="#619C8D" />
          <g clipPath="url(#clip0_2_1397)">
            <path d="M42.8307 45H16.5052C14.9407 45 13.668 43.7273 13.668 42.1628V15.8372C13.668 14.2728 14.9407 13 16.5052 13H42.8307C44.3952 13 45.668 14.2728 45.668 15.8372V42.1628C45.668 43.7273 44.3952 45 42.8307 45ZM16.5052 13.7837C15.3729 13.7837 14.4517 14.7049 14.4517 15.8372V42.1628C14.4517 43.2951 15.3729 44.2163 16.5052 44.2163H42.8307C43.963 44.2163 44.8843 43.2951 44.8843 42.1628V15.8372C44.8843 14.7049 43.963 13.7837 42.8307 13.7837H16.5052Z" fill="#619C8D" />
            <path d="M30.1588 19.7842H29.206H28.2097H25.1211V38.2162H29.206V32.9229H30.1588C33.787 32.9229 36.7282 29.9817 36.7282 26.3536C36.7282 22.7253 33.787 19.7842 30.1588 19.7842ZM32.9422 26.3535C32.9422 28.0007 31.6068 29.3361 29.9596 29.3361H29.2059V23.371H29.9596C31.6068 23.3709 32.9422 24.7063 32.9422 26.3535Z" fill="#619C8D" />
          </g>
          <defs>
            <clipPath id="clip0_2_1397">
              <rect width="32" height="32" fill="white" transform="translate(13.668 13)" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      title: "Guest Policies",
      desc: "Pet policies, event policies, and more",
      href:`/details/${propertyId}/listinginfo/guestpolicies`,
      totalSteps: 15,
      stepsCompleted: 7,
      icon: () => (
        <svg width="59" height="58" viewBox="0 0 59 58" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="58" height="57" rx="28.5" stroke="#619C8D" />
          <path d="M25.3333 19.6667H22.6667C21.1939 19.6667 20 20.8606 20 22.3333V38.3333C20 39.8061 21.1939 41 22.6667 41H36C37.4728 41 38.6667 39.8061 38.6667 38.3333V22.3333C38.6667 20.8606 37.4728 19.6667 36 19.6667H33.3333M25.3333 19.6667C25.3333 21.1394 26.5272 22.3333 28 22.3333H30.6667C32.1394 22.3333 33.3333 21.1394 33.3333 19.6667M25.3333 19.6667C25.3333 18.1939 26.5272 17 28 17H30.6667C32.1394 17 33.3333 18.1939 33.3333 19.6667M29.3333 29H33.3333M29.3333 34.3333H33.3333M25.3333 29H25.3467M25.3333 34.3333H25.3467" stroke="#619C8D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: "Recommendations",
      desc: "Detailed view of Surroundings",
      href:`/details/${propertyId}/listinginfo/recommendations`,
      totalSteps: 4,
      stepsCompleted: 1,
      icon: () => (
        <svg width="60" height="58" viewBox="0 0 60 58" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.16602" y="0.5" width="58" height="57" rx="28.5" stroke="#619C8D" />
          <path d="M28.9993 19.6667H22.3327C20.8599 19.6667 19.666 20.8606 19.666 22.3333V37C19.666 38.4728 20.8599 39.6667 22.3327 39.6667H36.9993C38.4721 39.6667 39.666 38.4728 39.666 37V30.3333M37.7804 17.781C38.8218 16.7397 40.5102 16.7397 41.5516 17.781C42.593 18.8224 42.593 20.5109 41.5516 21.5523L30.1039 33H26.3327L26.3327 29.2288L37.7804 17.781Z" stroke="#619C8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: "Arrival & Directions",
      desc: "Popular locations and nearby area guidance.",
      href:`/details/${propertyId}/listinginfo/arrival`,
      totalSteps: 9,
      stepsCompleted: 9,
      icon: () => (
        <svg width="60" height="58" viewBox="0 0 60 58" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.833984" y="0.5" width="58" height="57" rx="28.5" stroke="#619C8D" />
          <path d="M26.334 39.6668L19.071 36.0354C18.6193 35.8095 18.334 35.3478 18.334 34.8428V20.4909C18.334 19.4997 19.3771 18.855 20.2636 19.2983L26.334 22.3335M26.334 39.6668L34.334 35.6668M26.334 39.6668V22.3335M34.334 35.6668L40.4044 38.702C41.2909 39.1453 42.334 38.5006 42.334 37.5094V23.1575C42.334 22.6525 42.0486 22.1908 41.5969 21.965L34.334 18.3335M34.334 35.6668V18.3335M34.334 18.3335L26.334 22.3335" stroke="#619C8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: "Custom FAQ",
      desc: "Add Frequently asked questions",
      href:`/details/${propertyId}/listinginfo/customfaqs`,
      totalSteps: 11,
      stepsCompleted: 5,
      icon: () => (
        <svg width="59" height="58" viewBox="0 0 59 58" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="58" height="57" rx="28.5" stroke="#619C8D" />
          <path d="M24.5542 25C25.2864 23.4464 27.2619 22.3333 29.5841 22.3333C32.5296 22.3333 34.9174 24.1242 34.9174 26.3333C34.9174 28.1993 33.2139 29.7668 30.9097 30.2088C30.1865 30.3475 29.5841 30.9303 29.5841 31.6667M29.584 35.6667H29.5973M41.584 29C41.584 35.6274 36.2114 41 29.584 41C22.9566 41 17.584 35.6274 17.584 29C17.584 22.3726 22.9566 17 29.584 17C36.2114 17 41.584 22.3726 41.584 29Z" stroke="#619C8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: "Contact Info",
      desc: "Lorem ipsum dolor sit amet consectetur.",
      href:`/details/${propertyId}/listinginfo/contactinfo`,
      totalSteps: 8,
      stepsCompleted: 8,
      icon: () => (
        <svg width="60" height="58" viewBox="0 0 60 58" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.16602" y="0.5" width="58" height="57" rx="28.5" stroke="#619C8D" />
          <path d="M26.666 39.6668L19.4031 36.0354C18.9514 35.8095 18.666 35.3478 18.666 34.8428V20.4909C18.666 19.4997 19.7091 18.855 20.5956 19.2983L26.666 22.3335M26.666 39.6668L34.666 35.6668M26.666 39.6668V22.3335M34.666 35.6668L40.7364 38.702C41.6229 39.1453 42.666 38.5006 42.666 37.5094V23.1575C42.666 22.6525 42.3807 22.1908 41.929 21.965L34.666 18.3335M34.666 35.6668V18.3335M34.666 18.3335L26.666 22.3335" stroke="#619C8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
  ];
  const onFrameContainerClick = (card) => {
    setCurrentCard(card)
  }
  return (
    <Layout propertyId={propertyId} >
      <ListingLayout propertyId={propertyId} >
      <PropertyMain PropertyCards={PropertyCards} onFrameContainerClick={onFrameContainerClick}/>      
        {childern}
      </ListingLayout>
    </Layout>
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

export default ListinginfoIndexPage;