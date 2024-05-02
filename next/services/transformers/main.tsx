// /services/transformers/main.tsx
import { transformChannex } from './channex';
import { transformGuesty } from './guesty';
import { transformHostaway } from './hostaway';
import { transformHostfully } from './hostfully';
import { transformTokeet } from './tokeet';
import { transformZeevou } from './zeevou';

//yup validators
import { validateTransformedObjectSchemas } from '../schema-validators/property-details/main';

export async function transformProperty(integrationType: string, property_object: any): Promise <any> {
    try {
      switch (integrationType) {
        case 'zeevou':
          const transformedZeevouObject = transformZeevou({...property_object, integration_type: integrationType});          
          const validatedZeevou = await validateTransformedObjectSchemas(transformedZeevouObject, integrationType);
          console.log({validatedZeevou});
          //after transformation and validation we will return the object                  
          return transformedZeevouObject
        case 'guesty':
          const transformedGuestyObject = transformGuesty({...property_object, integration_type: integrationType});
          const validatedGuesty = await validateTransformedObjectSchemas(transformedGuestyObject, integrationType);
          //here we will create a function which will save the transformed object to database
          return transformedGuestyObject
        case 'hostfully':
          const transformedHostfullyObject = transformHostfully({...property_object, integration_type: integrationType});           
          //here we will create a function which will save the transformed object to database
          const validatedHostfully = await validateTransformedObjectSchemas(transformedHostfullyObject, integrationType);
          return transformedHostfullyObject
        case 'hostaway':
          const transformedHostawayObject = transformHostaway({...property_object, integration_type: integrationType});
          const _ = await validateTransformedObjectSchemas(transformedHostawayObject, integrationType)       
          //here we will create a function which will save the transformed object to database
          return transformedHostawayObject
        case 'tokeet':
          const transformedTokeetObject = transformTokeet({...property_object, integration_type: integrationType});          
          const validatedTokeet = await validateTransformedObjectSchemas(transformedTokeetObject, integrationType);
          //here we will create a function which will save the transformed object to database
          return transformedTokeetObject  
        case 'channex':
          const propertyObject = {...property_object.propertyObject, integrationType:integrationType}
          const transformedChannexObject = transformChannex({propertyObj:propertyObject, hotelPolicyObj: property_object.hotelPolicyObject}); 
          const validatedChannexObj = await validateTransformedObjectSchemas(transformedChannexObject, integrationType);         
          //here we will create a function which will save the transformed object to database
          return transformedChannexObject
        default:
          throw new Error(`Unsupported integrationType: ${integrationType}`);
      }
    } catch (error :any) {
      // Handle any errors that occur during transformation
      throw new Error(`Error transforming data: ${error}`);
    }
  }
  
