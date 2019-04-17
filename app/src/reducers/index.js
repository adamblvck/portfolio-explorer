import { combineReducers } from 'redux';

import BubblesReducer from './reducer_bubbles';
import GroupsReducer from './reducer_groups';
import ActiveConceptReducer from './reducer_active_concept';
import CryptoReducer from './reducer_crypto';
import FormReducer from './reducer_forms';

import { reducer as FormRedux } from 'redux-form';

const rootReducer = combineReducers({
  bubbles: BubblesReducer,
  groups: GroupsReducer,
  activeConcept: ActiveConceptReducer,
  crypto_prices: CryptoReducer,
  forms: FormReducer,
  form: FormRedux
});

export default rootReducer;
