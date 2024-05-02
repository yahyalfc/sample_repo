import { PropertyDetailAPIResponseInterface } from '../interfaces/propertyDetail.interface';

const initialObject: PropertyDetailAPIResponseInterface = require('../schema/propertyDetail.schema.json');
export const setPropertyDetailsReducerFunction = (property_data) => {
  const updateObjectRecursively = (target, source) => {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (typeof source[key] === 'object' && source[key] !== null) {
          if (!target[key]) {
            target[key] = Array.isArray(source[key]) ? [] : {};
          }
          updateObjectRecursively(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  };

  const updatedObject: any = {};

  try {
    updateObjectRecursively(updatedObject, property_data);
  } catch (error) {
    console.error('Error updating property-details object:', error);
  }

  return updatedObject;
};

export const setPropertyDataToEmptyReducerFunction = () => {
  return initialObject;
}