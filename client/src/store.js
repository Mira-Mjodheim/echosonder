```javascript
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const store = createStore(
  combineReducers(rootReducer),
  initialState,
  applyMiddleware(thunkMiddleware)
);

export default store;
```