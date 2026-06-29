const initialState = {
  contents: [],
  loading: false,
  error: null,
};

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CONTENTS_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_CONTENTS_SUCCESS':
      return { ...state, contents: action.payload, loading: false };
    case 'FETCH_CONTENTS_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'CREATE_CONTENT':
      return { ...state, contents: [...state.contents, action.payload] };
    case 'UPDATE_CONTENT':
      return {
        ...state,
        contents: state.contents.map((content) =>
          content._id === action.payload._id ? action.payload : content
        ),
      };
    case 'DELETE_CONTENT':
      return {
        ...state,
        contents: state.contents.filter(
          (content) => content._id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default contentReducer;
