import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';

import reducers from './reducers';

// createStore function with promise middleware
const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

// create a store, using the reducers specified in reducers/index.js
const store = createStoreWithMiddleware(reducers);

// export safely
export default store;