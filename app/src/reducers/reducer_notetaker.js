import { NEW_NOTE_NOTETAKER, EDIT_NOTE_NOTETAKER, HIDE_NOTETAKER} from '../actions/notetaker';

export default function(state = null, action) {
    switch(action.type) {
        case NEW_NOTE_NOTETAKER:

            const newState = { 
                note: action.payload, 
                open: true
            };

            console.log("newNote", newState);
            return newState;

        case EDIT_NOTE_NOTETAKER:

            const editState = {
                note: action.payload,
                open: true
            }

            console.log("editNote", editState);
            return editNote;

        case HIDE_NOTETAKER:
                console.log("hideNote");
            return {...state, open: false};

        default:
            return state;
    }
}