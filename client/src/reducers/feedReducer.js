const initialState = {
  items: [],
  page: 0,
  hasMore: true,
  loading: false,
  error: null,
};

const feedReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FEED_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FEED_SUCCESS':
      return {
        ...state,
        items: action.payload.page === 1
          ? action.payload.contents
          : [...state.items, ...action.payload.contents],
        page: action.payload.page,
        hasMore: action.payload.hasMore,
        loading: false,
      };
    case 'FEED_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default feedReducer;
