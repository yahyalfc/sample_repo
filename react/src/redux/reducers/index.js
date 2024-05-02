import { combineReducers } from "redux";
import ordersReducer from "./ordersReducer";
import locationReducer from './locationReducer'
import servicesReducer from './servicesReducers'
import userReducer from './userReducer'
import invoicesReducer from './invoicesReducer'

const rootReducer = combineReducers({
  user: userReducer, orders: ordersReducer, locations: locationReducer, services: servicesReducer, invoices: invoicesReducer
});

export default rootReducer;
