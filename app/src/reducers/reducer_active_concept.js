import { SHOW_CONCEPT_DETAIL } from '../actions';

export default function(state = null, action) {
    switch(action.type) {
        case SHOW_CONCEPT_DETAIL:
            return { ...action.meta, concept: action.payload.data.data.concept} ;
        default:
            return state;
    }

    return state;
}