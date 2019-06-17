export const NEW_NOTE_NOTETAKER = 'new_note_notetaker';
export const EDIT_NOTE_NOTETAKER = 'edit_note_notetaker';
export const HIDE_NOTETAKER = 'hide_notetaker';

export function NewNoteInNotetaker(note) {
    return {
        type: NEW_NOTE_NOTETAKER,
        payload: note
    }
}

export function EditNoteInNotetaker(note) {
    return {
        type: EDIT_NOTE_NOTETAKER,
        payload: note
    }
}

export function hideNotetaker() {
    return {
        type: HIDE_NOTETAKER,
        payload: {}
    }
}