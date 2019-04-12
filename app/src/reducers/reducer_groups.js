import _ from 'lodash';
import { FETCH_CONCEPTS, FETCH_ROOT_GROUPS_AND_CONCEPTS, UPDATE_CONCEPT, ADD_GROUP, EDIT_GROUP, DELETE_GROUP, FETCH_BUBBLE_GROUPS} from '../actions';


function mapKeysRecursive(root_groups){
    // goes into subgroups of every groups and performs another id sorting thingy on it :)
    

    var all_concepts = {};

    // Add <id, concept> value store, on the subgroups
    for(var key in root_groups) {
        var obj = root_groups[key];
        if (obj.groups){
                for(var key2 in obj.groups) {
                    var subgroup = obj.groups[key2];
                    if (subgroup.concepts){
                        // <key, value> map concepts array into a dictionary
                        subgroup.concepts = _.mapKeys(subgroup.concepts, 'id');

                        // add <key,value> of new concepts to all_concepts
                        all_concepts = {...all_concepts, ...subgroup.concepts };

                        // reduce <key, value> to an array of only keys
                        subgroup.concepts = Object.keys(subgroup.concepts);
                    }
                }
        }
    }

    // Add <id, group> value store, on the subgroups
    for(var key in root_groups) {
        var obj = root_groups[key];
        if (obj.groups){
            obj.groups = _.mapKeys(obj.groups, 'id');
        }
    }

    const reduced = {
        groups: _.mapKeys(root_groups, 'id'),
        concepts: all_concepts
    }

    return reduced;
}

function parseResponse(state, action){
    if (action && action.payload && action.payload.request){
        const { response } = action.payload.request;
        let error = handleErrors(response);

        if (action.payload.status == 200 && !error){
            window.location.reload(); // cheap trick, needs to replaced !
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

export default function (state = {}, action) {
    // because we're returning in each switch
    // we don't need a break in each case statement
    switch(action.type) {

        // QUERIES

        case FETCH_BUBBLE_GROUPS:

            console.log("bubble group reducing");
            console.log(action);

            if (action.payload.data)
                return mapKeysRecursive(action.payload.data.data.bubble_groups);
            else
                return state;

        case FETCH_CONCEPTS:
            return _.mapKeys(action.payload.data.data.groups, 'id');

        case FETCH_ROOT_GROUPS_AND_CONCEPTS:
            return mapKeysRecursive(action.payload.data.data.root_groups);

        
        case UPDATE_CONCEPT:
            if (action.payload.status == 200){
                const updatedConcept = action.payload.data.data.updateConcept;
                const newState = {...state};

                console.log(action.payload.data);

                newState.concepts[updatedConcept.id] = updatedConcept;

                console.log("UPDATE_CONCEPT newState", newState);

                return newState;
            } else {
                console.log("Couldn't update concept, got ",action.payload.status);
                return state;
            }

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
