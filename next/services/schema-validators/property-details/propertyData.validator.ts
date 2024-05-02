import { error } from 'console';
import * as yup from 'yup';
import { getValueByKeyPath } from '../../transformers/channex/helpers/getValueByKeyPath';

const requiredIfParentPropertyNotEmpty = (parentProperty) => {
  return yup.string().test('empty-string', `${parentProperty} is missing or of different type than expected`, function (value) {

    if (typeof value === 'string' && value.trim() === '') {
      // If the value is an empty string, consider it valid
      return true;
    }
    return getValueByKeyPath(this.parent, parentProperty) || typeof value === 'string'
  });
};

const faqSchema = yup.object().shape({
  question: yup.string().required(),
  answer: yup.string().required(),
  tag: yup.string().nullable(),
})

export const propertyYupSchemaValidator = yup.object().shape({
  property_id: requiredIfParentPropertyNotEmpty('property_id'),
  
  property_name: requiredIfParentPropertyNotEmpty('property_name'),
  property_description: requiredIfParentPropertyNotEmpty('property_description'),
  property_type: requiredIfParentPropertyNotEmpty('property_type'),
  integration_type: requiredIfParentPropertyNotEmpty('integration_type'),
  property_image_url: requiredIfParentPropertyNotEmpty('property_image_url').url('Please enter a valid URL for the image.'),
  guide_book_url: requiredIfParentPropertyNotEmpty('guide_book_url').url('Please enter a valid URL for the guide book.'),
  wifi_details: yup.object().shape({
    wifi_name: requiredIfParentPropertyNotEmpty('wifi_details.wifi_name'),
    wifi_password: requiredIfParentPropertyNotEmpty('wifi_details.wifi_password'),
    note: requiredIfParentPropertyNotEmpty('wifi_details.note')
  }),
  reservation: yup.object().shape({
    checkin: yup.object().shape({
      checkin_time_start: yup.object().shape({
        hour: requiredIfParentPropertyNotEmpty('reservation.checkin.checkin_time_start.hour'),
        minutes: requiredIfParentPropertyNotEmpty('reservation.checkin.checkin_time_start.minutes'),
        am_pm: requiredIfParentPropertyNotEmpty('reservation.checkin.checkin_time_start.am_pm')
      }),
      checkin_time_end: yup.object().shape({
        hour: requiredIfParentPropertyNotEmpty('reservation.checkin.checkin_time_end.hour'),
        minutes: requiredIfParentPropertyNotEmpty('reservation.checkin.checkin_time_end.minutes'),
        am_pm: requiredIfParentPropertyNotEmpty('reservation.checkin.checkin_time_end.am_pm')
      }),
      is_checkin_window: yup.boolean(),
      checkin_instructions: requiredIfParentPropertyNotEmpty('reservation.checkin.checkin_instructions'),
      self_checkin: yup.object().shape({
        availibility: yup.boolean(),
        note: requiredIfParentPropertyNotEmpty('reservation.checkin.self_checkin.note')
      }),
      early_checkin: yup.object().shape({
        option: requiredIfParentPropertyNotEmpty('reservation.checkin.early_checkin.option'),
        note: requiredIfParentPropertyNotEmpty('reservation.checkin.early_checkin.note')
      }),
      checkin_options: yup.array().of(requiredIfParentPropertyNotEmpty('reservation.checkin.checkin_options'))
    }),
    checkout: yup.object().shape({
      checkout_time_start: yup.object().shape({
        hour: requiredIfParentPropertyNotEmpty('reservation.checkout.checkout_time_start.hour'),
        minutes: requiredIfParentPropertyNotEmpty('reservation.checkout.checkout_time_start.minutes'),
        am_pm: requiredIfParentPropertyNotEmpty('reservation.checkout.checkout_time_start.am_pm')
      }),
      checkout_time_end: yup.object().shape({
        hour: requiredIfParentPropertyNotEmpty('reservation.checkout.checkout_time_end.hour'),
        minutes: requiredIfParentPropertyNotEmpty('reservation.checkout.checkout_time_end.minutes'),
        am_pm: requiredIfParentPropertyNotEmpty('reservation.checkout.checkout_time_end.am_pm')
      }),
      is_checkout_window: yup.boolean(),
      checkout_instructions: requiredIfParentPropertyNotEmpty('reservation.checkout.checkout_instructions'),
      self_checkout: yup.object().shape({
        availibility: yup.boolean(),
        note: requiredIfParentPropertyNotEmpty('reservation.checkout.self_checkout.note')
      })
    })
  }),
  location: yup.object().shape({
    lat: requiredIfParentPropertyNotEmpty('location.lat'),
    lng: requiredIfParentPropertyNotEmpty('location.lng'),
    country: requiredIfParentPropertyNotEmpty('location.country'),
    city: requiredIfParentPropertyNotEmpty('location.city'),
    complete_address: requiredIfParentPropertyNotEmpty('location.complete_address'),
    postal_code: requiredIfParentPropertyNotEmpty('location.postal_code'),
    time_zone: requiredIfParentPropertyNotEmpty('location.time_zone'),
    arrival_instruction: requiredIfParentPropertyNotEmpty('location.arrival_instruction'),
  }),
  accomodation: yup.object().shape({
    number_of_rooms: yup.number().min(0).required('This field is required.'),
    number_of_beds: yup.number().required('This field is required.'),
    number_of_bathrooms: yup.number().required('This field is required.'),
    number_of_kitchens: yup.number().required('This field is required.'),
    rooms: requiredIfParentPropertyNotEmpty('accomodation.rooms'),
    guest_capacity: yup.object().shape({
      max_guests: yup.number().required('This field is required.'),
      childern: yup.number().required('This field is required.'),
      infants: yup.number().required('This field is required.'),
      adults: yup.number().required('This field is required.')
    })
  }),
  financials: yup.object().shape({
    cleaning_fee: yup.number().required('This field is required.'),
    pet_fee: yup.number().required('This field is required.'),
    extra_person_fee: yup.number().required('This field is required.'),
    refundable_damage_deposit: yup.number().required('This field is required.'),
    currency: requiredIfParentPropertyNotEmpty('financials.currency')
  }),
  faqs: yup.array().of(faqSchema),
  amenities: yup.array().of(requiredIfParentPropertyNotEmpty('amenities')),
  guest_policies: yup.object().shape({
    smoking_policy: yup.object().shape({
      value: requiredIfParentPropertyNotEmpty('guest_policies.smoking_policy.value'),
      note: requiredIfParentPropertyNotEmpty('guest_policies.smoking_policy.note')
    }),
    pets_policy: yup.object().shape({
      value: requiredIfParentPropertyNotEmpty('guest_policies.pets_policy.value'),
      note: requiredIfParentPropertyNotEmpty('guest_policies.pets_policy.note')
    }),
    security_policy: requiredIfParentPropertyNotEmpty('guest_policies.security_policy'),
    parties_events_policy: yup.object().shape({
      value: requiredIfParentPropertyNotEmpty('guest_policies.pets_policy.value'),
      note: requiredIfParentPropertyNotEmpty('guest_policies.pets_policy.note')
    }),
    extra_person_policy: yup.object().shape({
      value: requiredIfParentPropertyNotEmpty('guest_policies.pets_policy.value'),
      note: requiredIfParentPropertyNotEmpty('guest_policies.pets_policy.note')
    }),
    internet_usage_policy: requiredIfParentPropertyNotEmpty('guest_policies.internet_usage_policy'),
    cancellation_policy: requiredIfParentPropertyNotEmpty('guest_policies.cancellation_policy'),
    property_policy: requiredIfParentPropertyNotEmpty('guest_policies.property_policy')
  }),
  terms: yup.object().shape({
    min_nights: yup.number().required('This field is required.'),
    max_nights: yup.number().required('This field is required.')
  }),
  contacts: yup.object().shape({
    personal_contact: yup.object().shape({
      name: requiredIfParentPropertyNotEmpty('contacts.personal_contact.name'),
      contact_number: requiredIfParentPropertyNotEmpty('contacts.personal_contact.contact_number'),
      email: requiredIfParentPropertyNotEmpty('contacts.personal_contact.email').email('Please enter a valid email address.')
    }),
    emergency_contacts: yup.object().shape({
      police_helpline: requiredIfParentPropertyNotEmpty('contacts.emergency_contacts.police_helpline'),
      firebrigade_helpline: requiredIfParentPropertyNotEmpty('contacts.emergency_contacts.firebrigade_helpline'),
      ambulance_helpline: requiredIfParentPropertyNotEmpty('contacts.emergency_contacts.ambulance_helpline') ,
      emergency_helpline: requiredIfParentPropertyNotEmpty('contacts.emergency_contacts.emergency_helpline') ,
    })
  }),
  transportation: yup.object().shape({
    options: yup.array().of(requiredIfParentPropertyNotEmpty('transportation.options')),
    note: requiredIfParentPropertyNotEmpty('transportation.note')
  }),
  recommendations: yup.array().of(yup.object().shape({
    type: requiredIfParentPropertyNotEmpty('recommendations.type'),
    title: requiredIfParentPropertyNotEmpty('recommendations.title'),
    note: requiredIfParentPropertyNotEmpty('recommendations.note')
  })),
  accessibility: yup.object().shape({
    options: yup.array().of(requiredIfParentPropertyNotEmpty('accessibility.options')),
    note: requiredIfParentPropertyNotEmpty('accessibility.note')
  }),
  parking: yup.object().shape({
    parking_type: requiredIfParentPropertyNotEmpty('parking.parking_type'),
    parking_reservation: requiredIfParentPropertyNotEmpty('parking.parking_reservation'),
    parking_is_private: yup.boolean(),
    parking_cost: requiredIfParentPropertyNotEmpty('parking.parking_cost'),
    accessibility_parking: yup.boolean(),
    parking_image_url: requiredIfParentPropertyNotEmpty('parking.parking_image_url').url('Please enter a valid URL for the parking image.'),
    total_spots: requiredIfParentPropertyNotEmpty('parking.total_spots'),
    additional_details: requiredIfParentPropertyNotEmpty('parking.additional_details')
  }),
  unit_types: yup.array().of(yup.object().shape({
    id: requiredIfParentPropertyNotEmpty('unit_types.id'),
    name: requiredIfParentPropertyNotEmpty('unit_types.name'),
    units: yup.array().of(requiredIfParentPropertyNotEmpty('unit_types.units')),
    extra_amenities: yup.array().of(requiredIfParentPropertyNotEmpty('unit_types.extra_amenities')),
  }))
});


// property_name: yup.string().nullable().test('empty-string', 'Property Name is required', function (value) {
//   return typeof value === 'string' && value.trim() === '' ? true : this.parent.property_id.trim() !== '' && this.schema.required.validate(value);
// }),
// property_description: yup.string().nullable().test('empty-string', 'Property Description is required', function (value) {
//   return typeof value === 'string' && value.trim() === '' ? true : this.parent.property_name.trim() !== '' && this.schema.required.validate(value);
// }),
// property_type: yup.string().nullable().test('empty-string', 'Property Type is required', function (value) {
//   return typeof value === 'string' && value.trim() === '' ? true : this.parent.property_name.trim() !== '' && this.schema.required.validate(value);
// }),
// integration_type: yup.string().nullable().test('empty-string', 'Integration Type is required', function (value) {
//   return typeof value === 'string' && value.trim() === '' ? true : this.parent.property_name.trim() !== '' && this.schema.required.validate(value);
// }),
// property_image_url: yup.string().nullable().test('empty-string', 'Property Image URL is required', function (value) {
//   return typeof value === 'string' && value.trim() === '' ? true : this.parent.property_name.trim() !== '' && this.schema.required.validate(value);
// }),
// guide_book_url: yup.string().nullable().test('empty-string', 'Guide Book URL is required', function (value) {
//   return typeof value === 'string' && value.trim() === '' ? true : this.parent.property_name.trim() !== '' && this.schema.required.validate(value);
// }),
// wifi_details: yup.object().shape({
//   wifi_name: yup.string().nullable().test('empty-string', 'WiFi Name is required', function (value) {
//       return typeof value === 'string' && value.trim() === '' ? true : this.parent.wifi_password.trim() !== '' && this.schema.required.validate(value);
//   }),
//   wifi_password: yup.string().nullable().test('empty-string', 'WiFi Password is required', function (value) {
//       return typeof value === 'string' && value.trim() === '' ? true : this.parent.wifi_name.trim() !== '' && this.schema.required.validate(value);
//   }),
//   note: yup.string().nullable()
// }),
// reservation: yup.object().shape({
//   checkin: yup.object().shape({
//       checkin_time_start: yup.object().shape({
//           hour: yup.string().nullable(),
//           minutes: yup.string().nullable(),
//           am_pm: yup.string().nullable()
//       }),
//       checkin_time_end: yup.object().shape({
//           hour: yup.string().nullable(),
//           minutes: yup.string().nullable(),
//           am_pm: yup.string().nullable()
//       }),
//       is_checkin_window: yup.boolean().nullable(),
//       checkin_instructions: yup.string().nullable(),
//       self_checkin: yup.object().shape({
//           availibility: yup.boolean().nullable(),
//           note: yup.string().nullable()
//       }),
//       early_checkin: yup.object().shape({
//           option: yup.string().nullable(),
//           note: yup.string().nullable()
//       }),
//       checkin_options: yup.array().nullable()
//   }),
//   checkout: yup.object().shape({
//       checkout_time_start: yup.object().shape({
//           hour: yup.string().nullable(),
//           minutes: yup.string().nullable(),
//           am_pm: yup.string().nullable()
//       }),
//       checkout_time_end: yup.object().shape({
//           hour: yup.string().nullable(),
//           minutes: yup.string().nullable(),
//           am_pm: yup.string().nullable()
//       }),
//       is_checkout_window: yup.boolean().nullable(),
//       checkout_instructions: yup.string().nullable(),
//       self_checkout: yup.object().shape({
//           availibility: yup.boolean().nullable(),
//           note: yup.string().nullable()
//       })
//   })
// }),
// location: yup.object().shape({
//   lat: yup.string().nullable(),
//   lng: yup.string().nullable(),
//   country: yup.string().nullable(),
//   city: yup.string().nullable(),
//   complete_address: yup.string().nullable(),
//   postal_code: yup.string().nullable(),
//   time_zone: yup.string().nullable()
// }),
// accommodation: yup.object().shape({
//   number_of_rooms: yup.number().nullable(),
//   number_of_beds: yup.number().nullable(),
//   number_of_bathrooms: yup.number().nullable(),
//   number_of_kitchens: yup.number().nullable(),
//   rooms: yup.string().nullable().test('empty-string', 'Rooms is required', function (value) {
//       return typeof value === 'string' && value.trim() === '' ? true : (this.parent.number_of_rooms !== undefined && this.parent.number_of_rooms !== 0) && this.schema.required.validate(value);
//   }),
//   guest_capacity: yup.object().shape({
//       max_guests: yup.number().nullable(),
//       children: yup.number().nullable(),
//       infants: yup.number().nullable(),
//       adults: yup.number().nullable()
//   })
// }),
// financials: yup.object().shape({
//   cleaning_fee: yup.number().nullable(),
//   pet_fee: yup.number().nullable(),
//   extra_person_fee: yup.number().nullable(),
//   refundable_damage_deposit: yup.number().nullable(),
//   currency: yup.string().nullable()
// }),
// faqs: yup.array().of(yup.string().nullable()),
// amenities: yup.array().of(yup.string().nullable()),
// guest_policies: yup.object().shape({
//   smoking_policy: yup.object().shape({
//       value: yup.string().nullable(),
//       note: yup.string().nullable()
//   }),
//   pets_policy: yup.object().shape({
//       value: yup.string().nullable(),
//       note: yup.string().nullable()
//   }),
//   security_policy: yup.string().nullable(),
//   parties_events_policy: yup.string().nullable(),
//   internet_usage_policy: yup.string().nullable(),
//   cancellation_policy: yup.string().nullable(),
//   property_policy: yup.string().nullable()
// }),
// terms: yup.object().shape({
//   min_nights: yup.number().nullable(),
//   max_nights: yup.number().nullable()
// }),
// contacts: yup.object().shape({
//   personal_contact: yup.object().shape({
//       name: yup.string().nullable(),
//       contact_number: yup.string().nullable(),
//       email: yup.string().nullable()
//   }),
//   emergency_contacts: yup.object().shape({
//       police_helpline: yup.string().nullable(),
//       firebrigade_helpline: yup.string().nullable()
//   })
// }),
// transportation: yup.object().shape({
//   options: yup.array().of(yup.string().nullable()),
//   note: yup.string().nullable()
// }),
// recommendations: yup.object().shape({
//   type: yup.string().nullable(),
//   title: yup.string().nullable(),
//   note: yup.string().nullable()
// }),
// accessibility: yup.object().shape({
//   options: yup.array().of(yup.string().nullable()),
//   note: yup.string().nullable()
// }),
// parking: yup.object().shape({
//   parking_type: yup.string().nullable(),
//   parking_reservation: yup.string().nullable(),
//   parking_is_private: yup.boolean().nullable(),
//   parking_cost: yup.string().nullable(),
//   accessibility_parking: yup.boolean().nullable(),
//   parking_image_url: yup.string().nullable(),
//   total_spots: yup.number().nullable(),
//   additional_details: yup.string().nullable()
// }),
// unit_count: yup.number().nullable(),
// unit_ids: yup.array().of(yup.string().nullable()),
// unit_types: yup.object().shape({
//   id: yup.string().nullable(),
//   name: yup.string().nullable(),
//   units: yup.array().of(yup.string().nullable()),
//   extra_amenities: yup.array().of(yup.string().nullable())
// })
