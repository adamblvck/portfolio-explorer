import { combineReducers } from 'redux';
import GroupsReducer from './reducer_groups';
import ActiveConceptReducer from './reducer_active_concept';

const rootReducer = combineReducers({
  groups: GroupsReducer,
  activeConcept: ActiveConceptReducer
});

export default rootReducer;
