import { createClient } from "@supabase/supabase-js";
import { PropertySchema } from "../../../transformers/property.interface";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE as string
  );

export const insertPropertyDataToSupabase = async (propertyObject : PropertySchema, database_property_id: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data: insertData, error: insertError } = await supabase
              .from('property_data')
              .insert([
                {
                  data_link_id: database_property_id,
                  property_id: propertyObject.property_id,

                  property_name: propertyObject.property_name,
                  property_description: propertyObject.property_description,
                  property_type: propertyObject.property_type,
                  integration_type: propertyObject.integration_type,
                  property_image_url: propertyObject.property_image_url,
                  guide_book_url: propertyObject.guide_book_url,
                  wifi_details: propertyObject.wifi_details,
                  reservation: propertyObject.reservation,
                  location: propertyObject.location,
                  accommodation: propertyObject.accomodation,
                  financials: propertyObject.financials,
                  faqs: propertyObject.faqs,
                  amenities: propertyObject.amenities,
                  guest_policies: propertyObject.guest_policies,
                  terms: propertyObject.terms,
                  contacts: propertyObject.contacts,
                  transportation: propertyObject.transportation,
                  recommendations: propertyObject.recommendations,
                  accessibility: propertyObject.accessibility,
                  parking: propertyObject.parking,
                  unit_types: propertyObject.unit_types,
                },
              ]).select();

            if (insertError) {
              console.error('Error inserting property data:', insertError);
              reject('Error while inserting data')
            } else {
              console.log('Inserted prop data:', insertData);
              resolve(insertData[0])
            }
          } catch (error) {
            console.error('Error inserting property data:', error);
            reject('Error while inserting data')
          }
    })
  };