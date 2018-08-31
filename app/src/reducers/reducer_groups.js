import _ from 'lodash';
import { FETCH_CONCEPTS } from '../actions';

export default function (state = {}, action) {
    switch(action.type) {
        case FETCH_CONCEPTS:
            return _.mapKeys(action.payload.data.groups, 'id');
        default:
            return state;
    }
}
