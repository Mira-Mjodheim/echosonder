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
    case 'FOLLOW_USER_SUCCESS': {
      if (!state.currentUser) return state;
      const others = (state.currentUser.following || []).filter((id) => id !== action.payload);
      return {
        ...state,
        currentUser: { ...state.currentUser, following: [...others, action.payload] },
      };
    }
    case 'UNFOLLOW_USER_SUCCESS': {
      if (!state.currentUser) return state;
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          following: (state.currentUser.following || []).filter((id) => id !== action.payload),
        },
      };
    }
    case 'FOLLOW_USER_FAILURE':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default userReducer;
