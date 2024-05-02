export interface UnitTypeFinalInterface {
    unit_type_id: string

    name: string
    marketing_name: string //string - nullable - true
    description: string //string - nullable - true
    average_house_keeping_time: number //number - nullable - true

    rate_plans: any []
    property: any //nullable - true
    units: Unit []

   
    accomodation_detail: AcommodationDetailsInterface
    
    extra_amenities: string [] //we converted this to string
    unit_type_size: number //integer - nullable - true
    unit_type_category: UnitTypeCategory //nullable - true
    parking_type: any //nullable - true
    created_at: string //string - nullable - true
    updated_at: string //string - nullable - true

    deposit : Deposit 
    deposit_weekly: Deposit 
    deposit_monthly: Deposit 
    deposit_config: DepositConfig //nullable - true
    
    unit_category: string //string - nullable - true
    extra_information: string //string - nullable - true
    cover_image: any //nullable - true

    /** these properties are not listed in the ERD and we are not returning them */
    staah_id: string
    unit_name_format: string //string - nullable - true
    abb_listing_id: string //string - nullable - true
    images: any
    unit_images: any
    // unit_count: number
}

interface AcommodationDetailsInterface {
    bedrooms: number //int - nullable - true
    maximum_capacity: number //integer - nullable - true
    hallway: number //integer - nullable - true
    kitchen: number //integer - nullable - true
    living_area: number //integer - nullable - true
    full_bathrooms: number //number - nullable - true

    rooms: RoomInterface []
    
    half_bathrooms: number //integer
    full_kitchens: number //integer
    kitchenettes: number //integer 
    dining_areas: number //integer
    offices: number //integer
    yards: number //integer
    patios: number //integer
    balconies: number //integer
    laundry_areas: number //integer
    basements: number //integer
    /** the properties below are useless  */
    full_shower_rooms: number //number - nullable - true
    full_bath_plus_shower_rooms: number //number - nullable - true
    toilets: number //number - nullable - true
    shower: number //number - nullable - true
    number_of_floors_per_unit: number //integer - nullable - true
}

interface Unit {
    id: string
    unit_size: number //nullable
}

interface DepositConfig {
    id: number
    authorization_type: string //nullable
    authorize_days_before_arrival: number //nullable
    release_days_after_departure: number //nullable
}

interface UnitTypeCategory {
    id: number
    name: number
    type: number
    show_name: string //nullable
}

interface Deposit {
    currency: string //nullable
    value: number
}

interface RoomInterface {
    id: number
    label: string
    room_type: string
    room_type_v2: RoomType
    bed_count: number
    bed_configs: BedConfig[]
    amenities: any []
}

interface RoomType {
    id: number
    name: string
    bed_configurable: boolean
    order: number
}

interface BedConfig {
    id: number
    count: number
    bed_type: BedTypeInterface
    bed_size: BedSizeInterface
    number_of_sleepers: number
    zip_and_link: boolean
    default_arrangement: string
    description: string
}

interface BedTypeInterface {
    id: number
    name: string
    description: string

    number_of_sleepers: number
    order: number
    prepared: boolean
    sizable: boolean
    can_edit_number_of_sleepers: boolean
    can_be_zip_and_link: boolean
}

interface BedSizeInterface {
    id: number
    name: string
    uk_name: string
    uk_description: string
    us_name: string
    us_description: string
    number_of_sleepers: number

    can_edit_number_of_sleepers: boolean
}