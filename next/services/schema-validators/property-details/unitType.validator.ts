import * as yup from 'yup';


/** Side object schemas */
const unitSchemaValidator = yup.object().shape({
  id: yup.string().required(),
  unit_size: yup.number().nullable()
})

const unitTypeCategoryValidator = yup.object().shape({
  id: yup.number().required(),
  unit_size: yup.number().nullable()
})

const depositObjectValidator = yup.object().shape({
  currency: yup.string().nullable(),
  value: yup.number()
})

const depositConfigObjectValidator = yup.object().shape({
    id: yup.number().required(),
    authorization_type: yup.string().nullable(),
    authorize_days_before_arrival: yup.number().nullable(), 
    release_days_after_departure: yup.number().nullable(), 
})

const roomTypeV2 = yup.object().shape({
  id: yup.number(),
  name: yup.string(),
  bed_configurable: yup.boolean().nullable(),
  order: yup.number().nullable()
})

/** Nested side object schemas */
//bed config
const bed_size = yup.object().shape({
  id: yup.number().required(),
  name: yup.string().required(),
  uk_name: yup.string().nullable(),
  uk_description: yup.string().nullable(),
  us_name: yup.string().nullable(),
  us_description: yup.string().nullable(),
  number_of_sleepers: yup.number().nullable(),
  can_edit_number_of_sleepers: yup.boolean().nullable(),
  can_be_zip_and_link: yup.boolean().nullable()
});

const bed_type = yup.object().shape({
  id: yup.number().required(),
  name: yup.string().required(),
  description: yup.string().nullable(),
  order: yup.number().nullable(),
  prepared: yup.boolean().nullable(),
  sizable: yup.boolean().nullable(),
  number_of_sleepers: yup.number().nullable(),
  can_edit_number_of_sleepers: yup.boolean().nullable(),
  can_be_zip_and_link: yup.boolean().nullable()
});

const bedConfig = yup.object().shape({
  id: yup.number().required(),
  room: yup.mixed().nullable(),
  count: yup.number().required(),
  bed_size: bed_size.nullable(),
  bed_type: bed_type.nullable(),
  number_of_sleepers: yup.number().nullable(),
  zip_and_link: yup.boolean().nullable(),
  default_arrangement: yup.string().nullable(),
  description: yup.string().nullable()
});

/**** Core object schemas */

const roomScehma = yup.object().shape({
  id: yup.number().required(),
  label: yup.string().nullable(),
  room_type: yup.string().nullable(),
  room_type_v2: roomTypeV2.nullable(),
  bed_count: yup.number().required(),
  bed_configs: yup.array().of(bedConfig).required(),
  amenities: yup.array().of(yup.mixed()).nullable(),
});

const accommodationSchema = yup.object().shape({
  bedrooms: yup.number().integer().min(0).nullable(),
  maximum_capacity: yup.number().integer().min(0).nullable(),
  hallway: yup.number().integer().min(0).nullable(),
  kitchen: yup.number().integer().min(0).nullable(),
  living_area: yup.number().integer().min(0).nullable(),
  full_bathrooms: yup.number().integer().min(0).nullable(),
  
  rooms: yup.array().of(roomScehma).required(),

  half_bathrooms: yup.number().integer().min(0).required(),
  full_kitchens: yup.number().integer().min(0).required(),
  kitchenettes: yup.number().integer().min(0).required(),
  dining_areas: yup.number().integer().min(0).required(),
  offices: yup.number().integer().min(0).required(),
  yards: yup.number().integer().min(0).required(),
  patios: yup.number().integer().min(0).required(),
  balconies: yup.number().integer().min(0).required(),
  laundry_areas: yup.number().integer().min(0).required(),
  basements: yup.number().integer().min(0).required(),

  full_shower_rooms: yup.number().integer().min(0).nullable(),
  full_bath_plus_shower_rooms: yup.number().integer().min(0).nullable(),
  toilets: yup.number().integer().min(0).nullable(),
  shower: yup.number().integer().min(0).nullable(),
  number_of_floors_per_unit: yup.number().integer().min(0).nullable(),
});

export const unitTypeYupSchemaValidator = yup.object().shape({
  unit_type_id: yup.string().required(),
 
  name: yup.string().required(),
  marketing_name: yup.string().nullable(),
  description: yup.string().nullable(),
  average_house_keeping_time: yup.number().nullable(),

  rate_plans: yup.array().of(yup.mixed()).nullable(),
  property: yup.mixed().nullable(),
  units: yup.array().of(unitSchemaValidator).required(),

  accomodation_detail: accommodationSchema.required(),
  
  /** till here */
  extra_amenities: yup.array().of(yup.string()).nullable(),
  unit_type_size: yup.number().integer().min(0).nullable(),
  unit_type_category: unitTypeCategoryValidator.nullable(),
  parking_type: yup.mixed().nullable(),
  created_at: yup.string().nullable(),
  updated_at: yup.string().nullable(),
  
  deposit: depositObjectValidator.nullable(),
  deposit_weekly: depositObjectValidator.nullable(),
  deposit_monthly: depositObjectValidator.nullable(),
  deposit_config: depositConfigObjectValidator.nullable(),

  unit_category: yup.string().nullable(),
  extra_information: yup.string().nullable(),
  cover_image: yup.mixed().nullable(),

  staah_id: yup.string().nullable(),
  unit_name_format: yup.string().nullable(),
  abb_listing_id: yup.string().nullable(),
  is_listed: yup.boolean().nullable(),
  images: yup.mixed().nullable(),
  unit_images: yup.mixed().nullable(),
  // unit_count: yup.number().integer().required(),
});

