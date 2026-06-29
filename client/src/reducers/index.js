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
