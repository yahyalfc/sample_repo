const defaultState = [];

const servicesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_SERVICES":
      return action.payload;
    default:
      return state;
  }
};

export default servicesReducer;
