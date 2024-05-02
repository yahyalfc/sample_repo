import { PropertySchema } from "../property.interface"; //interface for the property
import * as propertyData from "../property_schema.json";
const schema_property_object: PropertySchema = propertyData as PropertySchema; ////original property schema object
import mapping from "./mapper.json" //this is the mapper that contains the mapping of our property_object and the incoming pms object
/* The extractor functions - we will extract the data that is a bit complex and return the modified object, which will be set in this stage */
import {extractFunctions} from './extractor_functions';

export function transformGuesty(guesty_object: any) {
    // Create a copy of the schema_property_object
    const transformedObject: any = { ...schema_property_object };

    for (const [key, value] of Object.entries(mapping)) {
        if (Array.isArray(value)) {
            if (value.every(item => typeof item === 'string')) {
                const [extractor, parameter] = value;
                transformedObject[key] = extractFunctions[extractor](guesty_object[parameter], transformedObject);
            } else if (value.every(item => typeof item === 'object')) {
                value.forEach((obj: any) => {
                    const [extractor, parameters] = Object.entries(obj)[0]; // Extract the function name and parameters
                    if (Array.isArray(parameters)) {
                        const params = parameters as string[]; // Cast parameters to string[]
                        transformedObject[key] = extractFunctions[extractor](...params.map(param => guesty_object[param]), transformedObject);
                    } else {
                        const param = parameters as string; // Cast parameters to string
                        transformedObject[key] = extractFunctions[extractor](guesty_object[param], transformedObject);
                    }
                });
            }
        } else if (typeof value === 'string') {            
            const transformedValue = getValueFromPath(guesty_object, value);            
            if (transformedValue !== null && transformedValue !== undefined) {                
                assignValue(transformedObject, key, transformedValue);
            }
        } else if (typeof value === 'object') {
            const [extractor, parameters] = Object.entries(value)[0]; // Extract the function name and parameters
            if (Array.isArray(parameters)) {
                const params = parameters as string[]; // Cast parameters to string[]
                transformedObject[key] = extractFunctions[extractor](...params.map(param => guesty_object[param]), transformedObject);
            } else {
                const param = parameters as string; // Cast parameters to string
                transformedObject[key] = extractFunctions[extractor](guesty_object[param], transformedObject);
            }
        }
    }
    
    // Remove the default property
    delete transformedObject.default;
    return transformedObject;
}


function getValueFromPath(obj: any, path: string): any {
    // Check if the object or any intermediate property along the path is null or undefined
    if (!obj) return undefined;

    return path.split('.').reduce((o, key) => o?.[key], obj);
}

function assignValue(object: any, key: string, value: any) {
    // Early exit for undefined value
    if (value === undefined) return;

    // Split the key into an array of key parts (supports any depth)
    const keyParts = key.split('.');

    // Recursive helper function to navigate nested structure
    function traverse(obj: any, keyParts: string[]) {
        if (keyParts.length === 1) {
            // Base case: Assign value to the last key in the path
            obj[keyParts[0]] = value;
        } else {
            // Create nested object if it doesn't exist
            if (!obj[keyParts[0]]) {
                obj[keyParts[0]] = {};
            }
            // Recursively traverse for remaining key parts
            traverse(obj[keyParts[0]], keyParts.slice(1));
        }
    }

    // Initiate the recursive traversal
    traverse(object, keyParts);
}
