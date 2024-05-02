import { UnitAPIResponseInterface } from "../interfaces/unit.interface";

export const setUnitsReducerFunction = (units: UnitAPIResponseInterface[], state_units: UnitAPIResponseInterface[]) => {
    if (Array.isArray(units)) {
        const newUnits = units.filter((newUnit : UnitAPIResponseInterface) => {
            // Check if a unit with the same data_link_id already exists
            return !state_units.some(existingUnit => existingUnit.data_link_id === newUnit.data_link_id);
        });
        return newUnits; // Return the filtered units
    } else {
        return []; // Return an empty array if units is not an array
    }
}
