import _ from 'lodash';

import { FETCH_BUBBLES } from '../actions';

export default function (state = {}, action) {
    // state is the application state before belows switches
    // action.payload contains the data

    switch(action.type) {
        case FETCH_BUBBLES:
            let b = action.payload.data.data.bubbles;
            return _.mapKeys(b, 'id'); // made key-value store based on id
        default:
            return state;
    }
}