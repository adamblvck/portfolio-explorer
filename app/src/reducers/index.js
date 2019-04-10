import { combineReducers } from 'redux';

import BubblesReducer from './reducer_bubbles';
import GroupsReducer from './reducer_groups';
import ActiveConceptReducer from './reducer_active_concept';
import CryptoReducer from './reducer_crypto';

import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  bubbles: BubblesReducer,
  groups: GroupsReducer,
  activeConcept: ActiveConceptReducer,
  crypto_prices: CryptoReducer,
  form: formReducer
});

export default rootReducer;
