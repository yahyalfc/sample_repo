import { insertPropertyDataToSupabase } from "./property_insert";
import { insertUnitDataToSupabase } from "./unit_insert";
import { insertUnitTypeDataToSupabase } from "./unit_type_insert";

export async function insertPropertyDetailsDataToDB (property_object: any, integration_type:any, property_id: string ){
    return new Promise(async (resolve, reject) => {
        try {            
            if (integration_type == 'zeevou') {
                const { property, extractedUnitData} = property_object;
                const property_data :any = await insertPropertyDataToSupabase(property, property_id);
                
                console.log({property_data});
                
                //unit types and units need to be mapped one by one
        
                for (const eachUnitTypeAndUnits of extractedUnitData) {
                    const { units, unitType } = eachUnitTypeAndUnits
                    const unit_type_data :any = await insertUnitTypeDataToSupabase(unitType, property_data.data_link_id);  
                    const units_data :any= []

                    if (units.length) {
                        for (const unit of units) {
                            try {
                                const unit_data:any = await insertUnitDataToSupabase(unit, property_data.data_link_id, unit_type_data.data_link_id )
                                units_data.push(unit_data)
                            } catch (error) {
                                console.log('error in inserting unit or unit type to database');
                                console.log({error});
                                throw error
                            }
                        }
                    }
                    //here we can combine the unit type and its saved units and then return it to the main controller function
                }
                //after we are done inserting, we return
                resolve('Data inserted to Database')
            } else {
                const property_data :any = await  insertPropertyDataToSupabase(property_object, property_id);
                //here we can just return the property object
                resolve('Data inserted to Database')
            }
        
            } catch (error) {
                console.log('error casued in inserting property into the database');
                console.log({error});
                reject(error)
            }
    })
}
