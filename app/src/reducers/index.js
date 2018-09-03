import { combineReducers } from 'redux';
import GroupsReducer from './reducer_groups';
import ActiveConceptReducer from './reducer_active_concept';

import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  groups: GroupsReducer,
  activeConcept: ActiveConceptReducer,
  form: formReducer
});

export default rootReducer;
