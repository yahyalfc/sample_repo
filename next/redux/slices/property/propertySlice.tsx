import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { PropertyDetailAPIResponseInterface } from './interfaces/propertyDetail.interface';
import { UnitTypeAPIResponseInterface } from './interfaces/unitType.interface';
import { setPropertyDataToEmptyReducerFunction, setPropertyDetailsReducerFunction } from './reducers/property-details';
import { setPropertyToEmptyReducerFunction, setPropertyReducerFunction } from './reducers/property';
import { UnitAPIResponseInterface } from './interfaces/unit.interface';
import { setUnitsReducerFunction } from './reducers/units';
const propertyInitialObject = require("./schema/property.schema.json")
const propertyDetailInitialObject = require("./schema/propertyDetail.schema.json")
//how would the slice look like initially

export interface PropertyRedux {
  property_id: string,
  loader: boolean
  property: PropertyAPIResponseInterface,
  propertyDetail: PropertyDetailAPIResponseInterface
  unitTypes: UnitTypeAPIResponseInterface[]
  units: UnitAPIResponseInterface[]
}

const initialState: PropertyRedux  = {
  property_id: '',
  loader: false,
  property: propertyInitialObject,
  propertyDetail: propertyDetailInitialObject,
  unitTypes: [],
  units: []
};

export const PropertySlice = createSlice({
  name: 'property-detail',
  initialState,
  // Redux Toolkit allows us to write "mutating" logic in reducers. It doesn't actually mutate the state because it uses the Immer library,
  // which detects changes to a "draft state" and produces a brand new immutable state based off those changes
  //state contains the current value in the state
  reducers: {
      //----------------------------------------//
      /** These action functions are for loader */
      setPropertyLoadingReducer: (state, action : PayloadAction<any> ) => {
        // console.log('rdx act set-loader', state, action);
        const {payload, type} = action;
        const { propertyId, data: loader_state } = payload;

        state.loader = loader_state.loader
      },
      //---------------------------------------------------//
      /***** These action functions are for property *******/
      setPropertyDataReducer: (state, action: PayloadAction<any>) => {
      // console.log('rdx act set-property', state, action);
      const {payload, type} = action;
      const {propertyId, data: property} = payload;

      const property_updated = setPropertyReducerFunction(property)
      state.property = property_updated
      state.property_id = propertyId
      },
      resetPropertyDataReducer : (state, action: PayloadAction<any>) => {
        // console.log('rdx act reset-property', state, action);
        const { propertyId, data: property } = action.payload;

        const property_updated = setPropertyToEmptyReducerFunction();
        state.property = property_updated
        state.property_id = propertyId
      },
      //-------------------------------------------------------//
      /*** These action functions are for property_details *****/
      setPropertyDetailsReducer: (state, action: PayloadAction<any>) => {
        // console.log('rdx act set-property-details', state, action);
        const {payload, type} = action;
        const { propertyId, data: property_data } = payload;

        const updated_propertyDetail = setPropertyDetailsReducerFunction(property_data);
        state.propertyDetail = updated_propertyDetail
        state.property_id = propertyId
      },
      resetPropertyDetailsReducer : (state, action: PayloadAction<any>) => {
        // console.log('rdx act reset-property-details', state, action);
        const { propertyId, data: property_data } = action.payload;

        const updated_propertyDetail = setPropertyDataToEmptyReducerFunction();
        state.propertyDetail = updated_propertyDetail
        state.property_id = propertyId
      },
      //--------------------------------------------------//
      /**** These action functions are for unit-type *****/
      setUnitTypeReducer: (state, action: PayloadAction<any>) => {
        // console.log('rdx act set-unit-type', state, action);
        const {payload, type} = action;
        const {propertyId, data: unit_types} = payload;      

        state.unitTypes = unit_types?.length ? unit_types : []
        state.property_id = propertyId
        },
        resetUnitTypeReducer : (state, action: PayloadAction<any>) => {
          // console.log('rdx act reset-unit-type', state, action);
          const { propertyId, data: unit_types } = action.payload;
  
          state.unitTypes = []
          state.property_id = propertyId
        },
        //---------------------------------------------//
        /** These action functions are for units *******/
        setUnitsReducer: (state, action: PayloadAction<any>) => {
          // console.log('rdx act reset-unit-type', state, action);
          const { propertyId, data: {units, unit_type_id} } = action.payload;
          const newUnits : UnitAPIResponseInterface[] = setUnitsReducerFunction(units, state.units);
          if (newUnits?.length) {
            state.units = [...state.units, ...newUnits];
          }
          state.property_id = propertyId
        },
        resetUnitsReducer: (state, action: PayloadAction<any>) => {
        // console.log('rdx act reset-unit-type', state, action);
        const { propertyId, data: units } = action.payload;
  
        state.units = []
        state.property_id = propertyId
        },
      },
    })

// Action creators are generated for each case reducer function
export const { setPropertyLoadingReducer, setPropertyDetailsReducer,  setPropertyDataReducer, setUnitTypeReducer, setUnitsReducer} = PropertySlice.actions

export default PropertySlice.reducer