```javascript
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import contentReducer from './contentReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  user: userReducer,
  content: contentReducer,
  auth: authReducer,
});

export default rootReducer;
```

```javascript
// client/src/reducers/userReducer.js
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
```

```javascript
// client/src/reducers/contentReducer.js
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
```

```javascript
// client/src/reducers/authReducer.js
const initialState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, token: null };
    default:
      return state;
  }
};

export default authReducer;
```