import { PropertySchema } from "../property.interface";

/*
 * We are extracting on object level. Like instead of "accomodation.rooms": ["stringifyRooms", "listingRooms"] we will do "accomodation": ["stringifyRooms", "listingRooms"]
 * This way it changes the exact property and returns it back after updating that field
*/

export const extractFunctions: any = {
    extractDescription(fetchedDescription: any, extraNotes: string, ownerNotes: string, transformedObject: PropertySchema) {
        const description = `
            ${fetchedDescription && fetchedDescription.length > 0 && fetchedDescription[0]?.name ? `Name: ${fetchedDescription[0]?.name}\n` : ''}
            ${fetchedDescription && fetchedDescription.length > 0 && fetchedDescription[0]?.shortSummary ? `Summary: ${fetchedDescription[0]?.shortSummary}\n` : ''}
            ${extraNotes ? `Notes: ${extraNotes}\n` : ''}
            ${ownerNotes ? `Owner Notes: ${ownerNotes}\n` : ''}
            ${fetchedDescription && fetchedDescription.length > 0 && fetchedDescription[0]?.access ? `Access: ${fetchedDescription[0]?.access}\n` : ''}
            ${fetchedDescription && fetchedDescription.length > 0 && fetchedDescription[0]?.houseManual ? `House Manual: ${fetchedDescription[0]?.houseManual}\n` : ''}
        `.trim();
    
        return description;
    },
    extractCity(address: any, transformedObject: PropertySchema) {
        const {city, state} = address;
        
        const location = transformedObject.location;
        if (city && state) {
            location.city = (city ? city : "") + ", " + (state ? state : "");
        } else if (city || state) {
                        location.city = (city ? city : "") + ", " + (state ? state : "");

        }       
        return location
    },
    extractBathroomsAndRooms(bathrooms: string, fetchedRooms: any, transformedObject: PropertySchema) {
        const accomodation = transformedObject.accomodation;
        accomodation.number_of_bathrooms = parseInt(bathrooms);
        accomodation.rooms = JSON.stringify(fetchedRooms);

        return accomodation;
    },
    extractCheckinCheckoutTimes(availability:any, transformedObject: PropertySchema) {
        const reservation = transformedObject.reservation;
        const {checkin, checkout} = reservation;

        const checkin_time_start = convertTimeToParts(availability.checkInTimeStart);
        checkin.checkin_time_start.hour = checkin_time_start.hour
        checkin.checkin_time_start.minutes = checkin_time_start.minutes
        checkin.checkin_time_start.am_pm = checkin_time_start.am_pm

        if (availability?.checkInTimeEnd) {
            const checkin_time_end = convertTimeToParts(availability.checkInTimeEnd);
            checkin.checkin_time_end.hour = checkin_time_end.hour
            checkin.checkin_time_end.minutes = checkin_time_end.minutes
            checkin.checkin_time_end.am_pm = checkin_time_end.am_pm
            checkin.is_checkin_window = true
        }

        //Now lets calculate the checkout time
        const checkout_time_start = convertTimeToParts(availability.checkOutTime);
        checkout.checkout_time_start.hour = checkout_time_start.hour
        checkout.checkout_time_start.minutes = checkout_time_start.minutes
        checkout.checkout_time_start.am_pm = checkout_time_start.am_pm
        
        return reservation
    },
    extractAmenities(amenities: any, transformedObject: PropertySchema) {
        const processedAmenities = amenities.map((amenity: any) => amenity.amenity)
        const filtered = processedAmenities.map(name => {
            if (name.startsWith("HAS_")) {
                return name.substring(4).toLowerCase();
            } else {
                return name.toLowerCase();
            }
        });
        return filtered;
    },

    extractPolicies (cancellationPolicy: any, fetchedPropertyRules: any, transformedObject: PropertySchema) {
        const guest_policies = transformedObject.guest_policies;
        guest_policies.cancellation_policy = cancellationPolicy ? cancellationPolicy : "";
        guest_policies.pets_policy.value = fetchedPropertyRules.find(obj => obj.rule === "ALLOWS_PETS") ? "allowed" : "";
        guest_policies.smoking_policy.value = fetchedPropertyRules.find(obj => obj.rule === "ALLOWS_SMOKING") ? "allowed" : "";
        
        return guest_policies;
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