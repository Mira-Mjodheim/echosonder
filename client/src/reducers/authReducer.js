const initialState = {
  isAuthenticated: !!localStorage.getItem('echosonder_token'),
  token: localStorage.getItem('echosonder_token') || null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('echosonder_token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      localStorage.removeItem('echosonder_token');
      return { ...state, isAuthenticated: false, token: null };
    default:
      return state;
  }
};

export default authReducer;
