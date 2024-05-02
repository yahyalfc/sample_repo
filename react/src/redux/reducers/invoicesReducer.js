const defaultState = [];

const invoicesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_INVOICES":
      return action.payload;

    default:
      return state;
  }
};

export default invoicesReducer;
