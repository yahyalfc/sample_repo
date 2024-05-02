import { createClient } from "@supabase/supabase-js";
import { PropertySchema } from "../../../transformers/property.interface";
import { UnitTypeFinalInterface } from "../../../transformers/zeevou/unit_extractors/final_interfaces/unitType_final.interface";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE as string
  );

export const insertUnitTypeDataToSupabase = async (unitTypeObject : UnitTypeFinalInterface, property_link_id: string) => {
  console.log('fill');
  console.log({unitTypeObject});
  console.log({property_link_id});
  
  
    return new Promise(async (resolve, reject) => {
        try {

            const { data: insertData, error: insertError } = await supabase
      .from('zeevou_unit_type')
      .insert([
        {
          unit_type_id: unitTypeObject.unit_type_id,
          property_link_id: property_link_id,

          name: unitTypeObject.name,
          marketing_name: unitTypeObject.marketing_name,
          description: unitTypeObject.description,
          average_house_keeping_time: unitTypeObject.average_house_keeping_time,
          rate_plans: unitTypeObject.rate_plans,
          property: unitTypeObject.property,
          units: unitTypeObject.units,
          accomodation_detail: unitTypeObject.accomodation_detail,
          extra_amenities: unitTypeObject.extra_amenities,
          unit_type_size: unitTypeObject.unit_type_size,
          unit_type_category: unitTypeObject.unit_type_category,
          parking_type: unitTypeObject.parking_type,
          created_at: unitTypeObject.created_at,
          updated_at: unitTypeObject.updated_at,
          deposit: unitTypeObject.deposit,
          deposit_weekly: unitTypeObject.deposit_weekly,
          deposit_monthly: unitTypeObject.deposit_monthly,
          deposit_config: unitTypeObject.deposit_config,
          unit_category: unitTypeObject.unit_category,
          extra_information: unitTypeObject.extra_information,
          cover_image: unitTypeObject.cover_image,
          staah_id: unitTypeObject.staah_id,
          unit_name_format: unitTypeObject.unit_name_format,
          abb_listing_id: unitTypeObject.abb_listing_id,
          images: unitTypeObject.images,
          unit_images: unitTypeObject.unit_images,
        },
      ]).select();

            if (insertError) {
                console.error('Error inserting unit type data:', insertError);
                reject('Error while inserting data')
              } else {
                console.log('Inserted data:', insertData);
                resolve(insertData[0])
              }
            } catch (error) {
              console.error('Error inserting unit type data:', error);
              reject('Error while inserting data')
            }
      })
    };