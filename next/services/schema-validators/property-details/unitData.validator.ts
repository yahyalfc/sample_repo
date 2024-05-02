const yup = require('yup');


/** Side object schemas */
const checkInType = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    type: yup.string().required(),
    description: yup.string().nullable(),
});

const parkingType = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    description: yup.string().nullable(),
})

const unitTypeCategory = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    type: yup.string().required(),
    show_name: yup.string().nullable()
})
/** Nested side object schemas */

const keyPlaceAddress = yup.object().shape({
    id: yup.number().required(),
    latitude: yup.string().nullable(),
    longitude: yup.string().nullable(),
    first_line: yup.string().nullable(),
    second_line: yup.string().nullable(),
    city: yup.string().nullable(),
    postal_code: yup.string().nullable(),

    country: yup.object().shape({
        iso2_code: yup.string().required(),
        iso3_code: yup.string().required(),
    }).required(),
    region: yup.object().shape({
        combined_code: yup.string().required(),
        country: yup.mixed().nullable(),
        code: yup.string().required(),
        name: yup.string().required(),
    }).required(),

    full_address: yup.string().required(),
    region_code: yup.mixed().required(),
    complete_address: yup.string().required(),
    })

/**** Core object schemas */
const checkinTypes = yup.object().shape({
    id: yup.number().required(),
    checkin_type: checkInType.nullable(),
    priority: yup.number().required(),
    display_to_guest: yup.boolean().nullable(),
    checkin_instruction: yup.string().nullable(),
    checkout_instruction: yup.string().nullable(),
    code: yup.string().nullable(),
})

const wifiSchema = yup.object().shape({
    wifi_name: yup.string().nullable(),
    wifi_password: yup.string().nullable(),
    wifi_extra_instruction: yup.string().nullable(),
})

const parkingSchema = yup.object().shape({
    parking_extra_instruction: yup.string().nullable(),
    number_of_parking_spots: yup.mixed().nullable(),
    parking_spot_number: yup.mixed().nullable(),
    parking_type: parkingType.nullable()
})

const unitTypeSchema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    property: yup.mixed().nullable(),
    unit_type_category: unitTypeCategory.nullable(),
})

const checkInTypeSchema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    type: yup.string().required(),
    description: yup.string().nullable(),
})

const keysafeTypeSchema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    description: yup.string().nullable(),
})

const smartLockSchema = yup.object().shape({
    id: yup.number().required(),
    zeevou_name: yup.string().nullable(),
})

const keyPlaceProfileSchema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    key_place_type: yup.string().required(),
    opening_times: yup.string().nullable(),
    address: keyPlaceAddress.nullable()
    
})

export const unitYupSchemaValidator = yup.object().shape({
    unit_id: yup.string().required(),

    name: yup.string().required(),
    check_in_types: yup.array().of(checkinTypes),
    checkout_instruction: yup.string().nullable(),
    wifi: wifiSchema.required(),
    parking: parkingSchema.required(),
    checkin_instruction: yup.string().nullable(),

    maintenance_contact: yup.string().nullable(),
    images: yup.array().of(yup.mixed()).required(),
    unit_size: yup.number().nullable(),
    direction: yup.string().nullable(),
    entrance_code: yup.string().nullable(),
    access_code: yup.string().nullable(),
    min_walk: yup.string().nullable(),
    min_drive: yup.string().nullable(),
    guidebook_url: yup.string().nullable(),
    created_at: yup.string().nullable(),
    updated_at: yup.string().nullable(),

    status: yup.string().nullable(),
    unit_type: unitTypeSchema.nullable(),
    deal_type: yup.string().nullable(),
    key_safe_location: yup.string().nullable(),
    key_safe_label: yup.string().nullable(),
    other_access_instructions: yup.string().nullable(),

    check_in_type: checkInTypeSchema.nullable(),
    floor: yup.number().nullable(),
    checkin_highlighted_points: yup.string().nullable(),
    key_safe_type: keysafeTypeSchema.nullable(),
    has_storage: yup.boolean().nullable(),

    key_sets: yup.array().of(yup.mixed()),
    building: yup.mixed().nullable(),
    check_in_guide: yup.mixed().nullable(),
    house_manual: yup.mixed().nullable(),
    key_place_profile: keyPlaceProfileSchema.nullable(),
    smart_locks: yup.array().of(smartLockSchema),

    //null objects in docs
    has_smart_lock_integration: yup.mixed().nullable(),
    has_key_nest_integration: yup.mixed().nullable()
});
