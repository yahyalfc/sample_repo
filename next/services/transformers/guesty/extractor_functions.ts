import { PropertySchema } from "../property.interface";

/*
 * We are extracting on object level. Like instead of "accomodation.rooms": ["stringifyRooms", "listingRooms"] we will do "accomodation": ["stringifyRooms", "listingRooms"]
 * This way it changes the exact property and returns it back after updating that field
*/

export const extractFunctions: any = {
    extractPoliciesFromAmenities(amenities: any, transformedObject: PropertySchema) {
        const guest_policies = transformedObject.guest_policies;
        if (amenities?.includes("Smoking allowed")) {
            guest_policies.smoking_policy.value = "Smoking allowed";
        }
        if (amenities?.includes("Pets allowed")) {
            guest_policies.pets_policy.value = "Pets allowed";
        }
        //we also need to remove this amenity from amenities array
        return guest_policies;
    },
    stringifyRooms(listingRooms: any, transformedObject: PropertySchema) {
        const accomodation = transformedObject.accomodation;
        accomodation.rooms = JSON.stringify(listingRooms);
        return accomodation;
    },
    extractPicture(pictures: any, transformedObject: PropertySchema) {
        return pictures[0].original;
    },
    extractAmenities(amenities: any, transformedObject: PropertySchema) {
        const filteredAmenities = amenities.filter(amenity => amenity !== "Pets allowed" && amenity !== "Smoking allowed");
        return filteredAmenities;
    },
    extractCheckinCheckoutTimes(defaultCheckInTime: any, defaultCheckOutTime:any, checkInInstructions: any, checkOutInstructions: any, defaultCheckInEndTime: any, doorCode: string, lockCode: string, transformedObject: PropertySchema) {
        const reservation = transformedObject.reservation;
        const {checkin, checkout} = reservation;
        
        //checkin calculations
        const checkin_time_start = convertTimeToParts(defaultCheckInTime);
        checkin.checkin_time_start.am_pm = checkin_time_start?.am_pm;
        checkin.checkin_time_start.hour = checkin_time_start?.hour;
        checkin.checkin_time_start.minutes = checkin_time_start?.minutes;
        //chekin_time_end
        const checkin_time_end = convertTimeToParts(defaultCheckInEndTime);
        checkin.checkin_time_end.am_pm = checkin_time_end?.am_pm;
        checkin.checkin_time_end.hour = checkin_time_end?.hour;
        checkin.checkin_time_end.minutes = checkin_time_end?.minutes;
        //since we have both checkin_time start and checkin_time end we will have a window
        checkin.is_checkin_window = true
        //checkin_instruction extraction
        checkin.checkin_instructions = (checkInInstructions?.notes ? `${checkInInstructions?.notes}. ` : '') +
        (checkInInstructions?.primaryCheckIn ? `Primary checkin: ${checkInInstructions?.primaryCheckIn.toLowerCase()}. ` : '') +
        (checkInInstructions?.alternativeCheckIn ? `Alternative checkin: ${checkInInstructions?.alternativeCheckIn.toLowerCase()}.\n` : '') +
        (doorCode ? `Door code: ${doorCode}, ` : '') +
        (lockCode ? `Lock code: ${lockCode}.` : '');

        //checkout calcultaions
        const checkout_time_start = convertTimeToParts(defaultCheckOutTime);
        checkout.checkout_time_start.am_pm = checkout_time_start.am_pm;
        checkout.checkout_time_start.hour = checkout_time_start.hour;
        checkout.checkout_time_start.minutes = checkout_time_start.minutes;
        //checkout calculations
        checkout.checkout_instructions = checkOutInstructions || ""

        return reservation
    },
    extractParkingInfo (parkingInstructions: string, transformedObject: PropertySchema) {
        const parking = transformedObject.parking;
        parking.additional_details = parkingInstructions || ""
        return parking
    }
    // Add other extraction functions as needed
};

//Internal functions for extractor functions
function convertTimeToParts(timeString) {
    console.log({timeString});
    console.log('spllliiiittt');
    
    if (timeString) {

    
    const [hour, minutes] = timeString.split(':').map(Number);
    return {
        hour: ((hour % 12) || 12).toString(),
        minutes: minutes.toString().padStart(2, '0'),
        am_pm: hour >= 12 ? 'PM' : 'AM'
    };
} else  {
    return {
        hour: "0",
        minutes: "0",
        am_pm: ""
    }
}
}