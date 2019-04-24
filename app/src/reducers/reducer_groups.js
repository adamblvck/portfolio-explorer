import _ from 'lodash';
import { UPDATE_CONCEPT, DELETE_CONCEPT, ADD_CONCEPT} from '../actions/concept';
import { ADD_GROUP, EDIT_GROUP, DELETE_GROUP} from '../actions/group';
import { FETCH_BUBBLE_GROUPS} from '../actions/fetching_public';


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
            if (action.payload.status == 200){

                console.log("WOHOOO ADD GROUP", state, action);

                const { addGroup } = action.payload.data.data;
                const newState = {...state};

                let group_id = addGroup.id;
                let parent_group_id = addGroup.parent_groupId;

                if (parent_group_id == null){
                    newState.groups[group_id] = addGroup;
                }
                else {
                    newState.groups[parent_group_id].groups[group_id] = addGroup;
                }

                // change the modified counter to trigger a re-render of elements depending on groups
                newState.modified++;

                console.log("new state because of edit_group", newState);

                return newState;
            } else {
                console.log("Couldn't add group, got ",action.payload.status);
                return state;
            }

        case EDIT_GROUP:
            if (action.payload.status == 200){
                console.log("WOHOOO EDIT GROUP", state, action);

                const { updateGroup } = action.payload.data.data;
                const newState = {...state};

                let group_id = updateGroup.id;
                let parent_group_id = updateGroup.parent_groupId;

                // no parent id means we can alter a top-level group
                if (parent_group_id == null){
                    let prev_group = {
                        ...newState.groups[group_id],
                        ...updateGroup
                    };
                    newState.groups[group_id] = prev_group;
                } 
                
                // if we have a parent_id, we need to dig a little deeper in the structure
                else {
                    let prev_group = {
                        ...newState.groups[parent_group_id].groups[group_id],
                        ...updateGroup
                    };
                    newState.groups[parent_group_id].groups[group_id] = prev_group;
                }

                // change the modified counter to trigger a re-render of elements depending on groups
                newState.modified++;

                console.log("new state because of edit_group", newState);

                return newState;
            } else {
                console.log("Couldn't edit group, got ",action.payload.status);
                return state;
            }

        case DELETE_GROUP:

            if (action.payload.status == 200){
                console.log("WOHOOO EDIT GROUP", state, action);

                const { deleteGroup } = action.payload.data.data;
                const newState = {...state};

                let group_id = deleteGroup.id;
                let parent_group_id = deleteGroup.parent_groupId;

                // no parent id means we can alter a top-level group
                if (parent_group_id == null){
                    delete newState.groups[group_id];
                } 
                
                // if we have a parent_id, we need to dig a little deeper in the structure
                else {
                    delete newState.groups[parent_group_id].groups[group_id];
                }

                // change the modified counter to trigger a re-render of elements depending on groups
                newState.modified++;

                console.log("new state because of remove group", newState);

                return newState;
            } else {
                console.log("Couldn't remove group, got ", action.payload.status);
                return state;
            }

        // ODD ONES OUT, REMOVE IF NOT USED IN 2-3 sprint cycles
        // case FETCH_CONCEPTS:
        //     return _.mapKeys(action.payload.data.data.groups, 'id');

        // case FETCH_ROOT_GROUPS_AND_CONCEPTS:
        //     return mapKeysRecursive(action.payload.data.data.root_groups);



        // CATCH NO ACTIONS
        default:
            return state;
    }
}
