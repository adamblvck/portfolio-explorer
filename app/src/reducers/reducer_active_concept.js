import { SHOW_CONCEPT_DETAIL, CLOSE_CONCEPT_DETAIL, FETCH_AND_SHOW_CONCEPT_DETAIL } from '../actions/concept';

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
            return { ...action.meta, concept: action.payload.data.data.concept};

        case SHOW_CONCEPT_DETAIL:
            console.log("show_concept_detail triggered! WOHOOO", state, action);
            return {
                ...state,
                concept: action.payload, 
                background: action.payload.background, 
                open: true};

        case CLOSE_CONCEPT_DETAIL:
            return {...state, open: false};

        default:
            return state;
    }
}