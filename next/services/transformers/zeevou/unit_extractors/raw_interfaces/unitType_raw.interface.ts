export interface UnitTypeRawInterface {
    id: number
    name: string
    marketing_name: string //string - nullable - true
    description: string //string - nullable - true
    bedrooms: number //int - nullable - true
    maximum_capacity: number //integer - nullable - true
    average_house_keeping_time: number //number - nullable - true
    hallway: number //integer - nullable - true
    kitchen: number //integer - nullable - true
    living_area: number //integer - nullable - true
    full_shower_rooms: number //number - nullable - true
    full_bath_plus_shower_rooms: number //number - nullable - true
    full_bathrooms: number //number - nullable - true
    toilets: number //number - nullable - true
    shower: number //number - nullable - true
    staah_id: string //string - nullable - true
    rate_plans: any []
    rooms: RoomInterface []
    property: any //nullable - true
    units: Unit []
    unit_name_format: string //string - nullable - true
    unit_category: string //string - nullable - true
    number_of_floors_per_unit: number //integer - nullable - true
    extra_information: string //string - nullable - true
    parking_type: any //nullable - true
    extra_amenities: ExtraAmenities []
    unit_type_size: number //integer - nullable - true
    deposit_config: DepositConfig //nullable - true
    unit_type_category: UnitTypeCategory //nullable - true
    abb_listing_id: string //string - nullable - true
    cover_image: any //nullable - true
    created_at: string //string - nullable - true
    updated_at: string //string - nullable - true

    deposit : Deposit
    deposit_weekly: Deposit 
    deposit_monthly: Deposit 

    images: any
    unit_images: any

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

    // unit_count: number    
}

interface Unit {
    id: number 
    unit_size: number //nullable
}

interface DepositConfig {
    id: number
    authorization_type: string
    authorize_days_before_arrival: number
    release_days_after_departure: number
}

interface UnitTypeCategory {
    id: number
    name: number
    type: number
    show_name: string //nullable
}

interface Deposit {
    currency: string
    value: number
}

interface ExtraAmenities {
    id: number
    name: string
    description: string
    icon: string
    icon_file: any
}

interface RoomInterface {
    id: number
    label: string //nullable
    room_type: string //nullable
    room_type_v2: RoomType //nullable
    unit_type: any //nullable
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