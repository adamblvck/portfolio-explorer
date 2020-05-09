import { GETUSERINFO, CREATEUSER, CHECKUSERNAME } from '../actions/user';

import { fetchBoards } from '../actions/fetching_public';

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

    const action_types = [CREATEUSER, GETUSERINFO, CHECKUSERNAME];

    ///// Handle Errors
    if (action && action.payload && action.payload.request && action_types.includes(action.type)){
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
        case CREATEUSER:
            // console.log("create username", action.payload.data.data.checkusername);
            console.log("created username", action.payload.data.data.addUser);
            return { user: action.payload.data.data.addUser};

        case GETUSERINFO:
            console.log("Get user info", action.payload.data.data.addUser);

            const {user} = action.payload.data.data;

            const newState0 = {...state, user: user};
            if (newState0.modified == null)
                newState0.modified = 0;
            else 
                newState0.modified++;

            console.log("newstate", newState0);

            return newState0;

        case CHECKUSERNAME:
            console.log("created username", action.payload.data.data.addUser);
            const { usernameavailable } = action.payload.data.data;

            const newState = {...state, usernameavailable: usernameavailable};

            if (newState.modified == null)
                newState.modified = 0;
            else 
                newState.modified++;

            return newState;

        default:
            return state;
    }
}