import { GETUSERINFO } from '../actions/user';

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

    // state is the application state before belows switches
    // action.payload contains the data
    var error = false;

    ///// Handle Errors
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

    //// handle axtions

    switch(action.type) {
        case GETUSERINFO:
            console.log("auth reducer", action.payload.data.data.user);

            return { user: action.payload.data.data.user} ;
        default:
            return state;
    }
}