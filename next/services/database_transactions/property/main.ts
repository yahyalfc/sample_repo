import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE as string
  );

export async function insertPropertyToDatabase (property_id: string, user_id:string, platform: string ){
    return new Promise(async (resolve, reject) => {
        try {            
            const { data: propertyData, error: propertyError } = await supabase
                .from("properties")
                .insert([
                {
                  user_id,
                  airbnb_id: property_id,
                  platform,
                  connected: true,
                },
            ]).select();
            
            if (propertyError) {
                throw(propertyError)
            } else {
                resolve(propertyData[0])
            }
            } catch (error) {
                console.log('error casued in inserting property into the database');
                console.log({error});
                reject(error)
            }
    })
}
