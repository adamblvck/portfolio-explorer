import { OPEN_GROUP_FORM, CLOSE_GROUP_FORM, OPEN_CONCEPT_FORM, CLOSE_CONCEPT_FORM } from '../actions/form';

export default function(state = null, action) {
    switch(action.type){
        case OPEN_GROUP_FORM:
            const new_group_state = { ...action.payload};
            return new_group_state;
            
        case CLOSE_GROUP_FORM:
            // keep previous position
            const close_group_state = {
                ...state,
                open: false
            }
            return close_group_state;

        case OPEN_CONCEPT_FORM:
            const new_concept_state = { ...action.payload};
            return new_concept_state;

        case CLOSE_CONCEPT_FORM:
            // keep previous position
            const close_concept_state = {
                ...state,
                open: false
            }
            return close_concept_state;

        default:
            return state;
    }
}