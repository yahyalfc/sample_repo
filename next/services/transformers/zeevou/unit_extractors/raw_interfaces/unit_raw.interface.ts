export interface UnitRawInterface {
    id: number
    name: string
    status: string //string - nullable - true
    unit_type: UnitType //nullable - true
    deal_type: string //nullable - true
    access_code: string //nullable - true
    check_in_types: CheckInTypes []
    key_safe_location: string //nullable
    key_safe_label: string //nullable 
    other_access_instructions: string //nullable
    checkout_instruction: string //nullable
    wifi_name: string //nullable
    wifi_password: string //nullable
    wifi_extra_instruction: string //nullable
    parking_extra_instruction: string //nullable
    number_of_parking_spots: string //nullable
    parking_spot_number: string //nullable
    maintenance_contact: string //nullable
    check_in_type: CheckInType
    checkin_instruction: string //nullable
    floor: number //nullable
    checkin_highlighted_points: string //nullable
    images: any[]
    parking_type: ParkingType 
    key_safe_type: KeySafeType
    has_storage: boolean //nullable
    unit_size: number //nullable
    key_sets: any[]
    building: any
    check_in_guide: any //nullable
    house_manual: any //nullable
    direction: string //nullable
    entrance_code: string //nullable
    min_walk: string //nullable
    min_drive: string //nullable
    guidebook_url: string //nullable
    key_place_profile: KeyPlaceInterface //nullable
    smart_locks: SmartLock[]
    created_at: string
    updated_at: string
    is_active: boolean
    has_smart_lock_integration: any
    has_key_nest_integration: any
}

interface UnitType {
    id: number
    name: string
    property: any //nullable
    unit_type_category: any //nullable
    
    unit_count: number
    is_listed: boolean
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
    description: string //nullable
}

interface KeyPlaceInterface {
    id: number
    name: string
    key_place_type: string
    address: AddressInterface //nullable
    opening_times: string //nullable 
}

interface AddressInterface {
    id: number
    latitude: string //nullable
    longitude: string //nullable
    first_line: string //nullable
    second_line: string //nullable
    city: string //nullable
    postal_code: string //nullable
    country: any //nullable
    region: any //nullable
    full_address: string
    complete_address: string
}

interface SmartLock {
    id: number
    zeevou_name: string //nullable
}