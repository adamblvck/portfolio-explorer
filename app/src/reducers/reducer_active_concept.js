import { SHOW_CONCEPT_DETAIL, UPDATE_CONCEPT, DELETE_CONCEPT, ADD_CONCEPT } from '../actions';
import {reset} from 'redux-form';

function parseResponse(state, action){
    let error = null;

    if (action && action.payload && action.payload.request){
        const { response } = action.payload.request;
        error = handleErrors(response);
    }

    if (action.payload.status == 200 && !error){
        window.location.reload(); // cheap trick, needs to replaced !
    }

    return state;
}

function handleErrors(response){
    const obj = JSON.parse(response);

    if (obj.errors){
        obj.errors.forEach(function(element){
            alert("Error " + element.message);
        });

        return "errors";
    } else
        return null;
}

export default function(state = null, action) {
    switch(action.type) {
        case SHOW_CONCEPT_DETAIL:
            return { ...action.meta, concept: action.payload.data.data.concept} ;

        case UPDATE_CONCEPT:
            return parseResponse(state, action);
        case ADD_CONCEPT:
            return parseResponse(state, action);
        case DELETE_CONCEPT:
            return parseResponse(state, action);
        default:
            return state;
    }

    return state;
}