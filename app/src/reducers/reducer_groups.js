import _ from 'lodash';
import { FETCH_CONCEPTS, FETCH_ROOT_GROUPS_AND_CONCEPTS, ADD_GROUP, EDIT_GROUP, DELETE_GROUP, FETCH_BUBBLE_GROUPS} from '../actions';

// goes into subgroups of every groups and performs another id sorting thingy on it :)
function mapKeysRecursive(root_groups){
    for(var key in root_groups) {
        let obj = root_groups[key];
        if (obj.groups){
            obj.groups = _.mapKeys(obj.groups, 'id');
        }
    }

    return _.mapKeys(root_groups, 'id');
}

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

export default function (state = {}, action) {
    // because we're returning in each switch
    // we don't need a break in each case statement
    switch(action.type) {

        // QUERIES

        case FETCH_BUBBLE_GROUPS:

            console.log("bubble group reducing");
            console.log(action);

            return mapKeysRecursive(action.payload.data.data.bubble_groups);

        case FETCH_CONCEPTS:
            return _.mapKeys(action.payload.data.data.groups, 'id');

        case FETCH_ROOT_GROUPS_AND_CONCEPTS:
            return mapKeysRecursive(action.payload.data.data.root_groups);

        // MUTATIONS

        case ADD_GROUP:
            return parseResponse(state, action);
        case EDIT_GROUP:
            return parseResponse(state, action);
        case DELETE_GROUP:
            return parseResponse(state, action);

        // CATCH NO ACTIONS
        default:
            return state;
    }
}
