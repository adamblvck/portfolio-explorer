import { SHOW_CONCEPT_DETAIL, UPDATE_CONCEPT } from '../actions';
import {reset} from 'redux-form';

export default function(state = null, action) {
    switch(action.type) {
        case SHOW_CONCEPT_DETAIL:
            return { ...action.meta, concept: action.payload.data.data.concept} ;

        case UPDATE_CONCEPT:
            if (action.payload.status == 200){
                //window.location.reload(); // cheap trick, needs to replaced !
            }
            console.log(action);
            // return { ...action.meta, concept: action.payload.data.data.concept} ;
        default:
            return state;
    }

    return state;
}