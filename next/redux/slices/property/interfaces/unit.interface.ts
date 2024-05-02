export interface UnitAPIResponseInterface {
    data_link_id: string
    unit_id: string
    property_link_id: string
    unit_type_link_id: string

    name: string
    check_in_types: CheckInTypes [] //nullable

    checkout_instruction: string //nullable
    wifi: WifiInterface
    parking: ParkingInterface
    checkin_instruction: string //nullable

    maintenance_contact: string //nullable
    images: any[]
    unit_size: number //nullable
    direction: string //nullable
    entrance_code: string //nullable
    access_code: string //nullable - true
    min_walk: string //nullable
    min_drive: string //nullable
    guidebook_url: string //nullable
    created_at: string //nullable
    updated_at: string //nullable

     /** these properties are being returned from transformer but seem useless */
     status: string //string - nullable - true
     unit_type: UnitType //nullable - true
     deal_type: string //nullable - true
     key_safe_location: string //nullable
     key_safe_label: string //nullable 
     other_access_instructions: string //nullable
     
     check_in_type: CheckInType //nullable
     floor: number //nullable
     checkin_highlighted_points: string //nullable
     key_safe_type: KeySafeType //nullable
     has_storage: boolean //nullable

     key_sets: any[]
     building: any //nullable
     check_in_guide: any //nullable
     house_manual: any //nullable
     key_place_profile: KeyPlaceInterface //nullable
     smart_locks: SmartLock[]

     has_smart_lock_integration: any
     has_key_nest_integration: any
    }

interface UnitType {
    id: number
    name: string
    property: any //nullable
    unit_type_category: any //nullable
}

interface WifiInterface {
    wifi_name: string //nullable
    wifi_password: string //nullable
    wifi_extra_instruction: string //nullable
}

interface ParkingInterface {
    parking_extra_instruction: string //nullable
    number_of_parking_spots: string //nullable
    parking_spot_number: string //nullable
    parking_type: ParkingType //nullable
}

interface CheckInTypes {
    id: number
    checkin_type: CheckInType //nullable 
    priority: number
    display_to_guest: boolean //nullable
    checkin_instruction: string //nullable
    checkout_instruction: string //nullable
    code: string //nullable
}

interface CheckInType {
    id: number
    name: string
    type: string
    description: string //nullable
}

interface ParkingType {
    id: number
    name: string
    description: string //nullable
}

interface KeySafeType {
    id: number
    name: string
    description: string
}

interface KeyPlaceInterface {
    id: number
    name: string
    key_place_type: string
    address: AddressInterface
    opening_times: string
}

interface AddressInterface {
    id: number
    latitude: string //nullable
    longitude: string //nullable
    first_line: string //nullable
    second_line: string //nullable
    city: string //nullable
    postal_code: string //nullable

    country: Country //nullable
    region: RegionInterface //nullable
    full_address: string
    region_code: any
    complete_address: string
}

interface RegionInterface {
    combined_code: string
    country: Country //nullable
    code: string
    name: string
}
interface Country {
    iso2_code: string
    iso3_code: string
}

interface SmartLock {
    id: number
    zeevou_name: string
}