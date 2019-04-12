import { SHOW_CONCEPT_DETAIL, FETCH_AND_SHOW_CONCEPT_DETAIL, UPDATE_CONCEPT, DELETE_CONCEPT, ADD_CONCEPT } from '../actions';
import {reset} from 'redux-form';
import { STATES } from 'mongoose';

function parseResponse(state, action){
    if (action && action.payload && action.payload.request){
        const { response } = action.payload.request;
        var error = handleErrors(response);

        if (action.payload.status == 200 && !error){
            // window.location.reload(); // cheap trick, needs to replaced !
            return {concept: action.payload.data.data.updateConcept, open: true};
        }
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
        case FETCH_AND_SHOW_CONCEPT_DETAIL:
            return { ...action.meta, concept: action.payload.data.data.concept} ;    

        case SHOW_CONCEPT_DETAIL:
            console.log("show_concept_detail triggered! WOHOOO", state, action);
            return {concept: action.payload, background: action.payload.background, open: true};

        // case UPDATE_CONCEPT:
        //     if (action.payload.status == 200){
        //         return {...state, concept: action.payload.data.data.updateConcept}
        //     } else {
        //         console.log("Couldn't update concept, got ",action.payload.status);
        //         return state;
        //     }
        case ADD_CONCEPT:
            return parseResponse(state, action);
        case DELETE_CONCEPT:
            return parseResponse(state, action);
        default:
            return state;
    }
}