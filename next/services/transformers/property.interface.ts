export interface PropertySchema {
    property_id: string //Done
    property_name: string //Done
    property_description: string //Done
    property_type: string //Done
    integration_type: string //Done
    property_image_url: string //Done
    guide_book_url: string //Done
    wifi_details: WifiDetails //Done
    reservation: Reservation
    location: Location //Done
    accomodation: Accommodation
    financials: Financials
    amenities: string[] //Done
    faqs: FAQ [] //Done
    guest_policies: GuestPolicies
    terms: Terms
    contacts: Contacts //Not Available
    transportation: Transportation //Not Available
    recommendations: Recommendation[]
    accessibility: Accessibility
    parking: Parking //Done
    unit_types?: UnitType []
}

interface WifiDetails {
    wifi_name: string
    wifi_password: string
    note: string
}

interface Reservation {
    checkin: CheckIn
    checkout: Checkout
}

interface Location {
    lat: string
    lng: string
    country: string
    city: string
    complete_address: string
    postal_code: string
    time_zone: string
    arrival_instruction: string
}


interface Accommodation {
    number_of_rooms: number;
    number_of_beds: number;
    number_of_bathrooms: number;
    number_of_kitchens: number;
    guest_capacity: GuestCapacity; // Assuming this is a string type, you can change it to a number if needed
    rooms: string; // Assuming rooms is an array of strings representing room names - rooms info will be JSON stringified
}

interface Financials {
    cleaning_fee?: number;
    pet_fee?: number;
    extra_person_fee?: number; // Optional property denoted by "?"
    refundable_damage_deposit?: number;
    currency?: string; // Assuming currency is represented as a string code (e.g., "USD", "EUR")
}

interface GuestCapacity {
    max_guests: number;
    childern?: number; // Optional property denoted by "?"
    infants?: number; 
    adults?: number;
}
interface FAQ {
    question: string;
    answer: string;
    tag?: string; // Optional property denoted by "?"
}

interface GuestPolicies {
    smoking_policy: Policy
    pets_policy: Policy
    extra_person_policy: Policy
    security_policy: string;
    parties_events_policy: Policy;
    internet_usage_policy: string;
    cancellation_policy: string;
    property_policy: string;
}

interface Terms {
    min_nights: number;
    max_nights: number;
}

interface Contacts {
    personal_contact: PersonalContact
    emergency_contacts: EmergencyContact
}

interface Transportation {
    options: string[]
    note: string
}

interface Recommendation {
    type: string
    title: string
    note: string
}

interface Accessibility {
    options: string[]
    note: string
}

interface Parking {
    parking_type: string;
    parking_reservation: string;
    parking_is_private: boolean;
    parking_cost: string;
    accessibility_parking: boolean;
    parking_image_url: string;
    total_spots: number;
    additional_details?: string; // Optional additional details
}

interface UnitType {
    id: string;
    name: string;
    units: string[];
    extra_amenities: string[];
}

interface PersonalContact {
    name: string
    contact_number: string
    email: string

}

interface EmergencyContact {
    police_helpline: string
    firebrigade_helpline: string
    ambulance_helpline: string
    emergency_helpline: string
}

interface Policy {
    value: string
    note: string
}

interface CheckIn {
    checkin_time_start: CheckInTime;
    checkin_time_end: CheckInTime;
    is_checkin_window: boolean;
    checkin_instructions: string;
    self_checkin: SelfCheckIn;
    early_checkin: EarlyCheckIn;
    checkin_options: CheckInOptions[]; // Assuming an array of objects, adjust as needed
}

interface Checkout {
    checkout_time_start: CheckInTime;
    checkout_time_end: CheckInTime;
    is_checkout_window: boolean;
    checkout_instructions: string;
    self_checkout: SelfCheckIn;
}

interface CheckInTime {
    hour: string
    minutes: string
    am_pm: string
}

interface SelfCheckIn {
    availibility: boolean
    note: string
}

interface EarlyCheckIn {
    option: string
    note: string
}

interface CheckInOptions {
    selected_type: string
    note: string
    code: string
}