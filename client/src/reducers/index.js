import { combineReducers } from 'redux';
import userReducer from './userReducer';
import contentReducer from './contentReducer';
import authReducer from './authReducer';
import feedReducer from './feedReducer';

const rootReducer = combineReducers({
  user: userReducer,
  content: contentReducer,
  auth: authReducer,
  feed: feedReducer,
});

export default rootReducer;
