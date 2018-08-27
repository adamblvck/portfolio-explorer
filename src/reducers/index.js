import { combineReducers } from 'redux';
import GroupsReducer from './reducer_groups';

const rootReducer = combineReducers({
  groups: GroupsReducer
});

export default rootReducer;
