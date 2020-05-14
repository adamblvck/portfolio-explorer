import { OPEN_GROUP_FORM, CLOSE_GROUP_FORM, OPEN_CONCEPT_FORM, CLOSE_CONCEPT_FORM, OPEN_BOARD_FORM, CLOSE_BOARD_FORM, OPEN_PUBLISH_FORM, CLOSE_PUBLISH_FORM } from '../actions/form';

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

        case OPEN_BOARD_FORM:
            const new_board_state = { ...action.payload};
            return new_board_state;

        case CLOSE_BOARD_FORM:
            // keep previous position
            const close_board_state = {
                ...state,
                open: false
            }
            return close_board_state;

        case OPEN_PUBLISH_FORM:
            const new_publish_state = { ...action.payload};
            return new_publish_state;
    
        case CLOSE_PUBLISH_FORM:
            // keep previous position
            const close_publish_state = {
                ...state,
                open: false
            }
            return close_publish_state;

        default:
            return state;
    }
}