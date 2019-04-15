import _ from 'lodash';
import { FETCH_CONCEPTS, FETCH_ROOT_GROUPS_AND_CONCEPTS, UPDATE_CONCEPT, DELETE_CONCEPT, ADD_CONCEPT, ADD_GROUP, EDIT_GROUP, DELETE_GROUP, FETCH_BUBBLE_GROUPS} from '../actions';


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
        concepts: all_concepts,
        modified: 0
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
    var error = false;

    // Handle Errors
    if (action && action.payload && action.payload.request){
        const { response } = action.payload.request;
        var error = handleErrors(response);
    }

    if (error)
        return state;

    // because we're returning in each switch
    // we don't need a break in each case statement
    switch(action.type) {

        // DATA QUERIES
        case FETCH_BUBBLE_GROUPS:
            if (action.payload.data)
                return mapKeysRecursive(action.payload.data.data.bubble_groups);
            else
                return state;

        case FETCH_CONCEPTS:
            return _.mapKeys(action.payload.data.data.groups, 'id');

        case FETCH_ROOT_GROUPS_AND_CONCEPTS:
            return mapKeysRecursive(action.payload.data.data.root_groups);

        // CONCEPT MUTATIONS

        case ADD_CONCEPT:
            console.log("ADD_CONCEPT triggered! WOHOOO", state, action);

            if (action.payload.status == 200){
                const { addConcept } = action.payload.data.data;
                const newState = {...state};

                let root_group_id = addConcept.group.parent_groupId;
                let sub_group_id = addConcept.groupIds[0];
                let concept_id = addConcept.id;

                // add new ID to concept_id array
                newState.groups[root_group_id].groups[sub_group_id].concepts.push(concept_id);

                // add concept to concept dictionary
                newState.concepts[concept_id] = addConcept;

                // change the modified counter to trigger a re-render of elements depending on groups
                newState.modified++;

                console.log("new state because of add_concept", newState);

                return newState;
            } else {
                console.log("Couldn't add concept, got ",action.payload.status);
                return state;
            }

        case UPDATE_CONCEPT:
            if (action.payload.status == 200){
                const { updateConcept } = action.payload.data.data;
                const newState = {...state};

                // update concept at key updatedConcept.id with the newly received concept!
                newState.concepts[updateConcept.id] = updateConcept;

                // change the modified counter to trigger a re-render of elements depending on groups
                newState.modified++;

                return newState;
            } else {
                console.log("Couldn't update concept, got ",action.payload.status);
                return state;
            }
    
        case DELETE_CONCEPT:
            console.log("DELETE_CONCEPT triggered! WOHOOO", state, action);

            if (action.payload.status == 200){
                const { deleteConcept } = action.payload.data.data;
                const newState = {...state};

                let root_group_id = deleteConcept.group.parent_groupId;
                let sub_group_id = deleteConcept.group.id;
                let concept_id = deleteConcept.id;

                // remove concept_id from array
                let filtered_array = newState.groups[root_group_id].groups[sub_group_id].concepts.filter(function(item) { 
                    return item !== concept_id
                });
                newState.groups[root_group_id].groups[sub_group_id].concepts = filtered_array;

                // remove concept from concept dictionary
                delete newState.concepts[concept_id];

                // change the modified counter to trigger a re-render of elements depending on groups
                newState.modified++;

                console.log("new state because of delete_concept", newState);

                return newState;
            } else {
                console.log("Couldn't add concept, got ",action.payload.status);
                return state;
            }
        

        // GROUP MUTATIONS
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
