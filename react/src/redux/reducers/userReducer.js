const defaultState = null;

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;

    default:
      return state;
  }
};

export default userReducer;
