import _ from 'lodash';

import { FETCH_BUBBLES } from '../actions/fetching_public';
import { ADD_BUBBLE, EDIT_BUBBLE, DELETE_BUBBLE } from '../actions/bubble';

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

export default function (state = {}, action) {
    // state is the application state before belows switches
    // action.payload contains the data
    var error = false;

    // Handle Errors
    if (action && action.payload && action.payload.request){
        const { response } = action.payload.request;
        var error = handleErrors(response);
    }

    if (error)
        return state;

    if (action.error){
        console.log(action.payload);
        return state;
    }

    switch(action.type) {
        case FETCH_BUBBLES:
            let b = action.payload.data.data.bubbles;
            return _.mapKeys(b, 'id'); // made key-value store based on id
        
        case ADD_BUBBLE:
            const { addBubble } = action.payload.data.data;
            return { ...state, [addBubble.id]:addBubble};

        case EDIT_BUBBLE:
            const { updateBubble } = action.payload.data.data;

            console.log(updateBubble);

            return { ...state, [updateBubble.id]:updateBubble};

        case DELETE_BUBBLE:
            const { deleteBubble } = action.payload.data.data;

            const newState = { ...state };
            delete newState[deleteBubble.id];
            return newState;

        default:
            return state;
    }
}

