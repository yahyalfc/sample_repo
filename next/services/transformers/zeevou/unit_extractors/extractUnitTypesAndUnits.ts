import { UnitRawInterface } from "./raw_interfaces/unit_raw.interface";
import { UnitTypeRawInterface } from "./raw_interfaces/unitType_raw.interface";

/** IMPORTANT */
/** Here we have to generate unit_type_id and unit_id using uuid and also allocate property_id */

export function extractUnitTypesAndUnits(unitTypeAndUnitsData: any) {  
   
    const transformedData = unitTypeAndUnitsData.map((dataItem: any) => {
        const {unitType, units} = dataItem;

        return {
            unitType: mapUnitType(unitType),
            units: mapUnits(units)
        }
    });
    
    // const transformedObject: any = {};
    // transformedObject['unitTypeAndUnitsData'] = transformedData;
    return transformedData;
}

const mapUnitType = (rawUnitType : UnitTypeRawInterface) => {
    const {
        id, name, marketing_name, description, average_house_keeping_time, rate_plans, property,
        units, extra_amenities, unit_type_size, unit_type_category, parking_type, created_at, updated_at,
        deposit_config, deposit, deposit_weekly, deposit_monthly, unit_category, extra_information, cover_image,
        //staah_id, unit_name_format, abb_listing_id, is_listed, images, unit_images
        
        //these below are the values we will store in the accomodation_details 
        bedrooms, maximum_capacity, hallway, kitchen, living_area, full_bathrooms, 
        full_shower_rooms, full_bath_plus_shower_rooms, toilets, shower, number_of_floors_per_unit, rooms,
        half_bathrooms, full_kitchens, kitchenettes, dining_areas, offices, yards, patios, balconies, laundry_areas, basements
    } = rawUnitType;

    // Create accommodation object
    const accomodation_detail = {  
        bedrooms, 
        maximum_capacity,
        hallway, 
        kitchen, 
        living_area,
        full_bathrooms,

        rooms: conformTheAmenitiesInRooms(rooms), 
        half_bathrooms, 
        full_kitchens, 
        kitchenettes, 
        dining_areas, 
        offices,
        yards,
        patios, 
        balconies, 
        laundry_areas, 
        basements,

        /* the properties below are vague but we are returning anyways */
        full_shower_rooms,
        full_bath_plus_shower_rooms,
        toilets,
        shower,
        number_of_floors_per_unit
    };

    return {
        unit_type_id: JSON.stringify(id),
        name,
        marketing_name,
        description,
        average_house_keeping_time,

        rate_plans,
        property,
        units,
        accomodation_detail,

        extra_amenities : extractAmenities(extra_amenities),
        unit_type_size,
        unit_type_category,
        parking_type,
        created_at,
        updated_at,

        /** Properties below are vague but we are returning them */
        deposit,
        deposit_weekly,
        deposit_monthly,
        deposit_config,
        unit_category,
        extra_information,
        cover_image

        /** No properties are coming */
        // staah_id,
        // unit_name_format,
        // abb_listing_id,
        // is_listed,
        // images,
        // unit_images,
    };
}

//this function will extract the amenities at unit type level and give us back amenities in string form
const extractAmenities = (ammenitites) => {
    ammenitites.map((amenity: any) => amenity.name)
    return ammenitites
}

//this function will extract the room amenities and give us back room amenities in string form
const conformTheAmenitiesInRooms = (rooms: any[]) => {
    return rooms.map((room) => ({...room, amenities: extractAmenities(room.amenities)}))
}
/*************************************/
//Functionality to handle unit mapping
/*************************************/

const mapUnits = (units) => {
    if (units?.length) {
        //units are in the unit_type
       return units.map((unit: UnitRawInterface) => {
            //each unit will be run separately

            const {
                id, name, check_in_types, checkout_instruction, wifi_name, wifi_password, wifi_extra_instruction, parking_extra_instruction, number_of_parking_spots, parking_spot_number, parking_type,
                checkin_instruction, maintenance_contact, images, unit_size, direction, entrance_code, access_code, min_walk, min_drive, guidebook_url, created_at, updated_at,
                status, unit_type, deal_type, key_safe_location, key_safe_label, other_access_instructions,
                check_in_type, floor, checkin_highlighted_points, key_safe_type, has_storage, 
                key_sets, building, check_in_guide, house_manual, key_place_profile, smart_locks, has_smart_lock_integration, has_key_nest_integration,
            } = unit;

            return {
                unit_id: JSON.stringify(id),
                
                name, 
                check_in_types,
                checkout_instruction,
                wifi: {
                    wifi_name,
                    wifi_password,
                    wifi_extra_instruction
                },
                parking: {
                    parking_extra_instruction,
                    number_of_parking_spots,
                    parking_spot_number,
                    parking_type
                },
                checkin_instruction,

                maintenance_contact,
                images,
                unit_size,
                direction,
                entrance_code,
                access_code,
                min_walk,
                min_drive,
                guidebook_url,
                created_at,
                updated_at,

                
                /* the properties below are vague but we are returning them anyways */
                status,
                unit_type,
                deal_type,
                key_safe_location,
                key_safe_label,
                other_access_instructions,
                check_in_type,
                floor,
                checkin_highlighted_points,
                key_safe_type,
                has_storage,
                key_sets,
                building,
                check_in_guide,
                house_manual,
                key_place_profile,
                smart_locks,

                has_smart_lock_integration,
                has_key_nest_integration
            }
        })
    } else {
        return []
    }

}
