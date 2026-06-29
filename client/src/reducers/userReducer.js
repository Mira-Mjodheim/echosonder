const initialState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_USERS_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_USERS_SUCCESS':
      return { ...state, users: action.payload, loading: false };
    case 'FETCH_USERS_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    default:
      return state;
  }
};

export default userReducer;
