import { createClient } from "@supabase/supabase-js";
import { PropertySchema } from "../../../transformers/property.interface";
import { UnitFinalInterface } from "../../../transformers/zeevou/unit_extractors/final_interfaces/unit_final.interface";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE as string
  );

export const insertUnitDataToSupabase = async (unitDataObject : UnitFinalInterface, property_link_id: string, unit_type_link_id: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data: insertData, error: insertError } = await supabase
            .from('zeevou_unit_data')
            .insert([
              {
                unit_id: unitDataObject.unit_id,
                unit_type_link_id: unit_type_link_id,
                property_link_id: property_link_id,

                name: unitDataObject.name,
                check_in_types: unitDataObject.check_in_types,
                checkout_instruction: unitDataObject.checkout_instruction,
                wifi: unitDataObject.wifi,
                parking: unitDataObject.parking,
                checkin_instruction: unitDataObject.checkin_instruction,
                maintenance_contact: unitDataObject.maintenance_contact,
                images: unitDataObject.images,
                unit_size: unitDataObject.unit_size,
                direction: unitDataObject.direction,
                entrance_code: unitDataObject.entrance_code,
                access_code: unitDataObject.access_code,
                min_walk: unitDataObject.min_walk,
                min_drive: unitDataObject.min_drive,
                guidebook_url: unitDataObject.guidebook_url,
                created_at: unitDataObject.created_at,
                updated_at: unitDataObject.updated_at,
                status: unitDataObject.status,
                unit_type: unitDataObject.unit_type,
                deal_type: unitDataObject.deal_type,
                key_safe_location: unitDataObject.key_safe_location,
                key_safe_label: unitDataObject.key_safe_label,
                other_access_instructions: unitDataObject.other_access_instructions,
                check_in_type: unitDataObject.check_in_type,
                floor: unitDataObject.floor,
                checkin_highlighted_points: unitDataObject.checkin_highlighted_points,
                key_safe_type: unitDataObject.key_safe_type,
                has_storage: unitDataObject.has_storage,
                key_sets: unitDataObject.key_sets,
                building: unitDataObject.building,
                check_in_guide: unitDataObject.check_in_guide,
                house_manual: unitDataObject.house_manual,
                key_place_profile: unitDataObject.key_place_profile,
                smart_locks: unitDataObject.smart_locks,
                has_smart_lock_integration: unitDataObject.has_smart_lock_integration,
                has_key_nest_integration: unitDataObject.has_key_nest_integration,
              },
            ]).select();
      
            if (insertError) {
                console.error('Error inserting unit data:', insertError);
                reject('Error while inserting data')
              } else {
                console.log('Inserted data:', insertData);
                resolve(insertData[0])
              }
            } catch (error) {
              console.error('Error inserting unit data:', error);
              reject('Error while inserting data')
            }
      })
    };