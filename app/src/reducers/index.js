import { combineReducers } from 'redux';

import BoardsReducer from './reducer_boards';
import GroupsReducer from './reducer_groups';
import ActiveConceptReducer from './reducer_active_concept';
import CryptoReducer from './reducer_crypto';
import FormReducer from './reducer_forms';
import AuthReducer from './reducer_auth';
import MarkdownReducer from './reducer_markdown';
import NotetakerReducer from './reducer_notetaker';

import { reducer as FormRedux } from 'redux-form';

const rootReducer = combineReducers({
  boards: BoardsReducer,
  groups: GroupsReducer,
  activeConcept: ActiveConceptReducer,
  crypto_prices: CryptoReducer,
  forms: FormReducer,
  form: FormRedux,
  auth: AuthReducer,
  markdown: MarkdownReducer,
  notetaker: NotetakerReducer
});

export default rootReducer;
