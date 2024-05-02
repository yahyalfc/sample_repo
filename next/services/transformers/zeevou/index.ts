import { PropertySchema } from "../property.interface"; //interface for the property
import * as propertyData from "../property_schema.json";
const schema_property_object: PropertySchema = propertyData as any; ////original property schema object
import mapping from "./mapper.json" //this is the mapper that contains the mapping of our property_object and the incoming pms object
/* The extractor functions - we will extract the data that is a bit complex and return the modified object, which will be set in this stage */
import {extractFunctions} from './extractor_functions';
import { extractUnitTypesAndUnits } from "./unit_extractors/extractUnitTypesAndUnits";

export function transformZeevou(zeevou_object: any) {
    const {propertyObject, unitTypeAndUnitsData, integration_type} = zeevou_object;
    propertyObject.integration_type = integration_type; //in case of zeevou the integration type was not being saved cuz of the zeevou object having property, unit and unit types
     
    console.log('===============>', integration_type);
    
    //extracting unit types and units
    const extractedUnitData = extractUnitTypesAndUnits(unitTypeAndUnitsData);

    // Create a copy of the schema_property_object
    const transformedObject: any = { ...schema_property_object };

    for (const [key, value] of Object.entries(mapping)) {
        if (Array.isArray(value)) {
            if (value.every(item => typeof item === 'string')) {
                const [extractor, parameter] = value;
                transformedObject[key] = extractFunctions[extractor](propertyObject[parameter], transformedObject);
            } else if (value.every(item => typeof item === 'object')) {
                value.forEach((obj: any) => {
                    const [extractor, parameters] = Object.entries(obj)[0]; // Extract the function name and parameters
                    if (Array.isArray(parameters)) {
                        const params = parameters as string[]; // Cast parameters to string[]
                        transformedObject[key] = extractFunctions[extractor](...params.map(param => propertyObject[param]), transformedObject);
                    } else {
                        const param = parameters as string; // Cast parameters to string
                        transformedObject[key] = extractFunctions[extractor](propertyObject[param], transformedObject);
                    }
                });
            }
        } else if (typeof value === 'string') {            
            const transformedValue = getValueFromPath(propertyObject, value);            
            if (transformedValue !== null && transformedValue !== undefined) {                
                assignValue(transformedObject, key, transformedValue);
            }
        } else if (typeof value === 'object') {
            const [extractor, parameters] = Object.entries(value)[0]; // Extract the function name and parameters
            if (Array.isArray(parameters)) {
                const params = parameters as string[]; // Cast parameters to string[]
                transformedObject[key] = extractFunctions[extractor](...params.map(param => propertyObject[param]), transformedObject);
            } else {
                const param = parameters as string; // Cast parameters to string
                transformedObject[key] = extractFunctions[extractor](propertyObject[param], transformedObject);
            }
        }
    }
    
    // Remove the default property
    delete transformedObject.default;
    return { property: transformedObject, extractedUnitData};
}

function getValueFromPath(obj: any, path: string): any {
    // Check if the object or any intermediate property along the path is null or undefined
    if (!obj) return undefined;

    return path.split('.').reduce((o, key) => o?.[key], obj);
}

function assignValue(object: any, key: string, value: any) {
    // Check if key contains a period ('.') indicating a nested property
    if (key.includes('.')) {
        const [parentKey, nestedKey] = key.split('.');
        // Ensure parent object exists
        if (!object[parentKey]) {
            object[parentKey] = {};
        }
        // Set value for nested property
        object[parentKey][nestedKey] = value;
    } else {
        // Replace the original value with the transformed value directly
        if (value !== undefined) {
            object[key] = value;
        }
    }
}