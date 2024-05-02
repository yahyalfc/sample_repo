import { PropertySchema } from "../property.interface";

/*
 * We are extracting on object level. Like instead of "accomodation.rooms": ["stringifyRooms", "listingRooms"] we will do "accomodation": ["stringifyRooms", "listingRooms"]
 * This way it changes the exact property and returns it back after updating that field
*/

export const extractFunctions: any = {
    extractPropertyType(propertyTypeId: any, fetchedPropertyType: any, transformedObject: PropertySchema) {       
        const propertyType = fetchedPropertyType.result.find((propertyType:any) => propertyType.id == propertyTypeId)
        return propertyType.name;
    },
    extractDescription(fetchedDescription: any, houseRules: any, doorSecurityCode: any, keyPickup: any,  transformedObject: PropertySchema) {
        const description = `${fetchedDescription && fetchedDescription.length > 0 ? `${fetchedDescription}` : ''}
        ${houseRules && houseRules ? `House Rules: ${houseRules}\n` : ''}
        ${doorSecurityCode && doorSecurityCode ? `Door security code: ${doorSecurityCode}\n` : ''}
        ${keyPickup && keyPickup ? `Key pickup: ${keyPickup}\n` : ''}
        `.trim();
       
        return description;
    },
    extractImages(listingImages: any, transformedObject: PropertySchema) {
        return listingImages[0]?.url ? listingImages[0]?.url : "";
    },
    extractAmenities(listingAmenities: any, transformedObject: PropertySchema) {
        const processedAmenities = listingAmenities.map((amenity: any) => amenity.amenityName)       
        return processedAmenities;
    },
    extractCheckinCheckoutTimes(checkInTimeStart:any, checkInTimeEnd: any, checkOutTime: any, transformedObject: PropertySchema) {
        const reservation = transformedObject.reservation;
        const {checkin, checkout} = reservation;
       
        checkin.checkin_time_start = convertTimeToParts(checkInTimeStart)
        checkin.checkin_time_end = convertTimeToParts(checkInTimeEnd)
        checkin.is_checkin_window = true;

        checkout.checkout_time_start = convertTimeToParts(checkOutTime)

        return reservation
    },
    extractRoomsAndGuestCapacity(roomType: any, bedroomsNumber: any, fetchedBedType: any, listingBedTypes: any, maxChildrenAllowed: any, maxInfantsAllowed: any, personCapacity: any, transformedObject: PropertySchema) {
        const accomodation = transformedObject.accomodation;
        
        accomodation.guest_capacity.infants = maxInfantsAllowed ? maxInfantsAllowed : 0;
        accomodation.guest_capacity.childern = maxChildrenAllowed ? maxChildrenAllowed : 0;
        accomodation.guest_capacity.max_guests = personCapacity ? personCapacity : 0;
       
        const room_beds = listingBedTypes.map((bed:any) => ({...bed, bedType: fetchedBedType.result.find((bedType) => bedType.id == bed.bedTypeId).name}))
        //There is no structure for rooms in the hostaway object so we will create it ourselves
        const rooms = JSON.stringify({roomType, numberOfRooms: bedroomsNumber, bedTypes: room_beds})
        accomodation.rooms = rooms;

        return accomodation;
    },
    extractPolicies(cancellationPolicy: any, listingAmenities: any, transformedObject: PropertySchema) {
        const guest_policies = transformedObject.guest_policies;
        guest_policies.cancellation_policy = cancellationPolicy ? cancellationPolicy : "";

        const processedAmenities = listingAmenities.map((amenity: any) => amenity.amenityName)       
        const smoking_policy = processedAmenities.find((amenity) => amenity == "Smoking allowed");
        const pets_policy = processedAmenities.find((amenity) => amenity == "Pets allowed")

        if (smoking_policy) {
            guest_policies.smoking_policy.value = "allowed"
        } else if (pets_policy) {
            guest_policies.pets_policy.value = "allowed"
        }
        
        return guest_policies;
    },
    extractContacts (contactName: any, contactSurName: any, contactPhone1: any, contactEmail: any, transformedObject: PropertySchema) {
        const contacts = transformedObject.contacts;
        contacts.personal_contact.contact_number = contactPhone1
        contacts.personal_contact.email = contactEmail
        contacts.personal_contact.name = contactName + " " + contactSurName
        
        return contacts;
    }
    
    // Add other extraction functions as needed
};

//Internal functions for extractor functions
function convertTimeToParts(time) {
    const hour = time >= 12 ? ((time % 12) || 12).toString() : (time || 12).toString();
    const minutes = '00'; // Assuming no minutes provided
    const am_pm = time >= 12 ? 'PM' : 'AM';
    
    return {
        hour,
        minutes,
        am_pm
    };
}