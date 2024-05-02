import { PropertySchema } from "../property.interface"; //interface for the property
import * as propertyData from "../property_schema.json";
const schema_property_object: PropertySchema = propertyData as PropertySchema; ////original property schema object
import mapping from "./mapper.json" //this is the mapper that contains the mapping of our property_object and the incoming pms object
/* The extractor functions - we will extract the data that is a bit complex and return the modified object, which will be set in this stage */
import {extractFunctions} from './extractor_functions';

export function transformHostaway(hostaway_object: any) {
    console.log('hostttaway input obje', hostaway_object);
    
    try {
    // Create a copy of the schema_property_object
    const transformedObject: any = { ...schema_property_object };

    for (const [key, value] of Object.entries(mapping)) {
        if (Array.isArray(value)) {
            if (value.every(item => typeof item === 'string')) {
                const [extractor, parameter] = value;
                transformedObject[key] = extractFunctions[extractor](hostaway_object[parameter], transformedObject);
            } else if (value.every(item => typeof item === 'object')) {
                value.forEach((obj: any) => {
                    const [extractor, parameters] = Object.entries(obj)[0]; // Extract the function name and parameters
                    if (Array.isArray(parameters)) {
                        const params = parameters as string[]; // Cast parameters to string[]
                        transformedObject[key] = extractFunctions[extractor](...params.map(param => hostaway_object[param]), transformedObject);
                    } else {
                        const param = parameters as string; // Cast parameters to string
                        transformedObject[key] = extractFunctions[extractor](hostaway_object[param], transformedObject);
                    }
                });
            }
        } else if (typeof value === 'string') {            
            const transformedValue = getValueFromPath(hostaway_object, value);            
            if (transformedValue !== null && transformedValue !== undefined) {                
                assignValue(transformedObject, key, transformedValue);
            }
        } else if (typeof value === 'object') {
            const [extractor, parameters] = Object.entries(value)[0]; // Extract the function name and parameters
            if (Array.isArray(parameters)) {
                const params = parameters as string[]; // Cast parameters to string[]
                transformedObject[key] = extractFunctions[extractor](...params.map(param => hostaway_object[param]), transformedObject);
            } else {
                const param = parameters as string; // Cast parameters to string
                transformedObject[key] = extractFunctions[extractor](hostaway_object[param], transformedObject);
            }
        }
    }
    
    // Remove the default property
    delete transformedObject.default;
    console.log('=====> transformation complete');
    
    return transformedObject;
    } catch (error) {
        console.log('error in hostfully transfoer', error);
        throw error
    }
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