import { OPEN_GROUP_FORM, CLOSE_GROUP_FORM } from '../actions/form';

export default function(state = null, action) {
    switch(action.type){
        case OPEN_GROUP_FORM:
            const new_state = { ...action.payload};
            return new_state;
            
        case CLOSE_GROUP_FORM:
            // keep previous position
            const close_state = {
                ...state,
                open: false
            }

            return close_state;

        default:
            return state;
    }
}