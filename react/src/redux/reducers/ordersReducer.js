const defaultState = [];

const ordersReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_ORDERS":
      return action.payload;

    default:
      return state;
  }
};

export default ordersReducer;
