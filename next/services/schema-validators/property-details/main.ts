
import * as yup from 'yup'
import { propertyYupSchemaValidator } from './propertyData.validator';
import { unitTypeYupSchemaValidator } from './unitType.validator';
import { unitYupSchemaValidator } from './unitData.validator';


  /** In case its zeevou, we need to validate the property as well as units. In rest of the property types we only need to validate property  */
export  async function validateTransformedObjectSchemas (transformed_property_object: any, integration_type: string) {
    return new Promise(async (resolve, reject) => {
        try {
        if (integration_type == 'zeevou') {
            await zeevouValidation(transformed_property_object)
            resolve(transformed_property_object)
          } else {
            await propertyValidation(transformed_property_object)
            resolve(transformed_property_object)
          }       
        } catch (error) {
            console.log('error - validateTransformedObjectSchemas');
            console.log({error});
            reject('An error occured while validating the schema')
        }
    })
}

/** in case of zeevou we will validate property and unit type and units */
  async function zeevouValidation (propertyAndUnitObject) {
    return new Promise(async (resolve, reject) => {
      const {property, extractedUnitData} = propertyAndUnitObject;
      
      try {
          const validatedPproperty = await propertyValidation(property);
          /* [  unitType - [units], unitType - [units]  ]  */          
      for (const eachUnitTypeAndUnits of extractedUnitData) {
          const { units, unitType } = eachUnitTypeAndUnits
          const validatedUnitYype = await unitTypeValidation(unitType)  
          
          if (units.length) {
              for (const unit of units) {
                  try {
                      const validatedUnit = await unitsValidation(unit)                      
                  } catch (error) {
                      console.log('error in yup validating unit');
                      console.log({error});
                      throw error
                  }
              }
          }
      }
      resolve(propertyAndUnitObject)  
      } catch (error) {
          console.log('error in zeevou validation function');
          console.log({error});    
          reject(error); // Rethrow the error to propagate it further
      }
    })
   
  }

  /** Validators for property, unit and unit types */
  async function propertyValidation (property_object: any) {
    return new Promise(async (resolve, reject) => {
        try {
          console.log("Property Object in the validator: ",JSON.stringify(property_object, null, 3))
            const valid = await propertyYupSchemaValidator.validate(property_object, { abortEarly: false });
            resolve(property_object)
          } catch (error) {
            if (error instanceof yup.ValidationError) {
              // Yup validation error occurred
              const validationErrors = error.inner.map((e) => ({
                field: e.path,
                message: e.message,
              }));
              console.log('property validation error');
              console.error(validationErrors)
              reject('property object validation failed')
            }
            else{
              console.log(error)
            }
          }
    })
  }

  async function unitTypeValidation (unit_type_object: any) {  
    return new Promise(async (resolve, reject) => {
        try {
            const valid = await unitTypeYupSchemaValidator.validate(unit_type_object, { abortEarly: false });
            resolve(unit_type_object)
          } catch (error) {
            if (error instanceof yup.ValidationError) {
              // Yup validation error occurred
              const validationErrors = error.inner.map((e) => ({
                field: e.path,
                message: e.message,
              }));
              console.log('unit type validation error');
              console.error(validationErrors)
              reject('Unit type object validation failed')
            }
          }
    })
  }

  async function unitsValidation (unit_object: any) {  
    return new Promise(async (resolve, reject) => {
        try {
            const valid = await unitYupSchemaValidator.validate(unit_object, { abortEarly: false });
            resolve(unit_object)
          } catch (error) {
            if (error instanceof yup.ValidationError) {
              // Yup validation error occurred
              const validationErrors = error.inner.map((e) => ({
                field: e.path,
                message: e.message,
              }));
              console.log('unit validation error');
              console.error(validationErrors)
              reject('Unit object validation failed')
            }
          }
    })
  }