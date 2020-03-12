import _ from 'lodash';

import { FETCH_BOARDS } from '../actions/fetching_public';
import { ADD_BOARD, EDIT_BOARD, DELETE_BOARD, FETCH_BOARD, UPDATE_BOARD_LAYOUT} from '../actions/board';
import { UPDATE_CONCEPT, DELETE_CONCEPT, ADD_CONCEPT} from '../actions/concept';
import { ADD_GROUP, EDIT_GROUP, DELETE_GROUP, UPDATE_GROUP_LAYOUT, UPDATE_CONCEPT_LAYOUT, UPDATE_CONCEPT_LAYOUT_SPECIAL} from '../actions/group';

function mapKeysRecursive(root_groups){
    // goes into subgroups of every groups and performs another id sorting thingy on it :)
    var all_concepts = {};

    const hmm = root_groups;

    // console.log('groups reducer', hmm);

    // Add <id, concept> value store, on the subgroups
    for(var key in root_groups) {
        var obj = root_groups[key];

        // map keys subgroups and concepts
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

                // map keys on concept_layouts in subgroup 
                if (subgroup.concept_layouts){
                    subgroup.concept_layouts = _.mapKeys(subgroup.concept_layouts, 'name');
                }
            }
        }

        // map keys on group_layouts 
        if (obj.group_layouts) {
            obj.group_layouts = _.mapKeys(obj.group_layouts, 'name');
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
        modified: Math.round(Math.random() * 100000)
    }

    return reduced;
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
        // console.log(action.payload);
        return state;
    }

    switch(action.type) {
        case FETCH_BOARD:
            if (action.payload.status == 200 && action.payload.data){

                // console.log(action.payload.data.data.board);

                const reduced = {
                    id: action.payload.data.data.board.id,
                    board_id: action.payload.data.data.board.board_id,
                    group_layouts: _.mapKeys(action.payload.data.data.board.group_layouts, 'name'),
                    groups: mapKeysRecursive(action.payload.data.data.board.groups)
                }
                
                return reduced;
            }
            else
                return state;

        case UPDATE_BOARD_LAYOUT:
            if (action.payload.status == 200 && action.payload.data){

                // console.log("UDPATE_BOARD_LAYOUT", action.payload.data.data.updateBoard);

                const reduced = {
                    ...state,
                    group_layouts: _.mapKeys(action.payload.data.data.updateBoard.group_layouts, 'name'),
                }
                
                return reduced;
            }
            else
                return state;

        case FETCH_BOARDS:
            let b = action.payload.data.data.boards;
            return _.mapKeys(b, 'id'); // made key-value store based on id
        
        case ADD_BOARD:
            const { addBoard } = action.payload.data.data;
            return { ...state, [addBoard.id]:addBoard};

        case EDIT_BOARD:
            const { updateBoard } = action.payload.data.data;

            // console.log(updateBoard);

            return { ...state, [updateBoard.id]:updateBoard};

        case DELETE_BOARD:
            const { deleteBoard } = action.payload.data.data;

            const newState = { ...state };
            delete newState[deleteBoard.id];
            return newState;

        // -----------------------------
        // GROUP MUTATIONS CAPTURED HERE
        // -----------------------------

        case ADD_GROUP:
            if (action.payload.status == 200){

                // console.log("We have 200!", state, 'action', action);

                const { addGroup } = action.payload.data.data;
                const newState = {...state};

                // get out a few variables
                const { id, parent_groupId, board_id, board, parent_group } = addGroup;

                // return group_layouts, depending if we're having a board, or a parent_group
                const group_layouts = board ? board.group_layouts : (parent_group ? parent_group.group_layouts : []); 

                // if no group as parent ...
                if (parent_groupId == null) { // we're dealing with a top-level group
                    newState.groups.groups[id] = addGroup; // add to list of groups
                    newState.group_layouts = _.mapKeys(group_layouts, 'name'); // update group_layouts in this board
                }
                else { // lower-tier group - dig in deeper.

                    if (newState.groups.groups[parent_groupId].groups === undefined) // create new object
                        newState.groups.groups[parent_groupId].groups = {}

                    newState.groups.groups[parent_groupId].groups[id] = addGroup; // assign group as new id
                    newState.groups.groups[parent_groupId].group_layouts = _.mapKeys(group_layouts, 'name'); // update group_layouts in parent group
                }

                // change the modified counter to trigger a re-render of elements depending on groups
                newState.groups.modified = Math.round(Math.random() * 100000);
                
                // console.log("new state because of ADD_GROUP", newState);

                return newState;
            } else {
                console.log("Couldn't add group, got ",action.payload.status, "for status");
                return state;
            }

        case EDIT_GROUP:
            if (action.payload.status == 200) {
                // console.log("WOOOW EDIT GROUP", state, action);

                // get the updateGroup
                const { updateGroup } = action.payload.data.data;

                // an new state
                const newState = {...state};

                // pull essential parameters
                let { id, parent_groupId } = updateGroup;

                // no parent id means we're altering a top-level group
                if (parent_groupId == null) {

                    // update the group by taking the previous states, and adding the changes of `updateGroup`
                    newState.groups.groups[id] = {
                        ...newState.groups.groups[id], 
                        ...updateGroup
                    };

                }

                // if we have a parent_id, we need to dig a little deeper in the structure
                else {

                    // update nesState with the group that's a subgroup, and add the parameters which we got returned from the API
                    newState.groups.groups[parent_groupId].groups[id] = {
                        ...newState.groups.groups[parent_groupId].groups[id],
                        ...updateGroup
                    };

                }

                // change the modified counter to trigger a re-render of elements depending on groups
                newState.groups.modified = Math.round(Math.random() * 100000);

                // console.log("new state because of edit_group:", newState);

                return newState;
            } else {
                console.log("Couldn't edit group, got ",action.payload.status);
                return state;
            }

        case DELETE_GROUP:
            if (action.payload.status == 200) {
                // console.log("Deleting group in reducer", state, action);

                const { deleteGroup } = action.payload.data.data;
                const newState = {...state};

                // get out a few variables
                const { id, parent_groupId, board_id, board, parent_group } = deleteGroup;

                // return group_layouts, depending if we're having a board, or a parent_group
                const group_layouts = board ? board.group_layouts : (parent_group ? parent_group.group_layouts : []); 

                // ...
                if (parent_groupId == null){ // we're dealing with a top-level group
                    delete newState.groups[id]; // remove from list
                    newState.group_layouts = _.mapKeys(group_layouts, 'name'); // update group_layouts in this board
                }
                else { // lower-tier group - dig in deeper.
                    delete newState.groups.groups[parent_groupId].groups[id];
                    newState.groups.groups[parent_groupId].group_layouts = _.mapKeys(group_layouts, 'name'); // update group_layouts in parent group
                }

                // change the modified counter to trigger a re-render of elements depending on groups
                newState.groups.modified = Math.round(Math.random() * 100000);
                // console.log("new state because of remove group", newState);

                return newState;
            } else {
                console.log("Couldn't remove group, got ", action.payload.status);
                return state;
            }

        case UPDATE_GROUP_LAYOUT:
            if (action.payload.status == 200) {
                // console.log("Updating group layout", state, action);

                const { updateGroup } = action.payload.data.data;
                const newState = {...state};

                // get out a few variables
                console.log(updateGroup);
                const { id, parent_groupId, group_layouts } = updateGroup;

                // ...
                if (parent_groupId == null){ // we're the layout of subgroups in a top-tier group
                    newState.groups.groups[id].group_layouts = _.mapKeys(group_layouts, 'name'); // update group_layouts in parent group
                }
                else { // lower-tier group - dig in deeper.
                    
                }

                // change the modified counter to trigger a re-render of elements depending on groups
                newState.groups.modified = Math.round(Math.random() * 100000);
                // console.log("new state because of update group layout", newState);

                return newState;
            }

        case UPDATE_CONCEPT_LAYOUT:
            if (action.payload.status == 200) {
                // console.log("---Updating concept layout", state, action);

                const { updateGroup } = action.payload.data.data;
                const newState = {...state};

                // get out a few variables
                const { id, parent_groupId, group_layouts, concept_layouts } = updateGroup;

                // ...
                if (parent_groupId == null){ // we're the layout of subgroups in a top-tier group
                    newState.groups.groups[id].group_layouts = _.mapKeys(group_layouts, 'name'); // update group_layouts in parent group
                }
                else { // lower-tier group - dig in deeper.
                    newState.groups.groups[parent_groupId].groups[id].concept_layouts = _.mapKeys(concept_layouts, 'name');
                }

                // change the modified counter to trigger a re-render of elements depending on groups
                newState.groups.modified = Math.round(Math.random() * 100000);
                // console.log("---new state because of update group layout", newState);

                return newState;
            }

        case UPDATE_CONCEPT_LAYOUT_SPECIAL:
            if (action.payload.status == 200) {
                // console.log("-s-Updating concept layout", state, action);

                const { updateConceptLayout } = action.payload.data.data;
                const newState = {...state};

                console.log(updateConceptLayout, newState);

                for (let i=0; i<updateConceptLayout.length; i++) {
                    const group = updateConceptLayout[i];

                    const {id, parent_groupId } = group;

                    // map key the concepts, it gets twisty but keep calm :)
                    newState.groups.groups[parent_groupId].groups[id].concepts = _.mapKeys(group.concepts, 'id');

                    // // then finally mapKeys the concept layouts
                    newState.groups.groups[parent_groupId].groups[id].concept_layouts = _.mapKeys(group.concept_layouts, 'name');
                }

                // change the modified counter to trigger a re-render of elements depending on groups
                newState.groups.modified = Math.round(Math.random() * 100000);
                // console.log("---new state because of update group layout", newState);

                return newState;
            }

        // -----------------------------
        // CONCEPT MUTATIONS CAPTURED HERE
        // -----------------------------

        case ADD_CONCEPT:
            // console.log("ADD_CONCEPT triggered! WOHOOO", state, action);

            if (action.payload.status == 200){
                const { addConcept } = action.payload.data.data;
                const newState = {...state};

                // get out a few variables
                const { group } = addConcept;
                const _id = addConcept.id;
                const { id, parent_groupId, concept_layouts } = group;

                console.log(newState);
                console.log(group, _id, id, parent_groupId, concept_layouts, addConcept);

                // add new ID to concept_id array
                newState.groups.groups[parent_groupId].groups[id].concepts.push(_id);

                // add concept to concept dictionary
                newState.groups.concepts[_id] = addConcept;

                // re-edit the layout of the subgroup
                newState.groups.groups[parent_groupId].groups[id].concept_layouts = _.mapKeys(concept_layouts, 'name');

                // Trigger re-render
                newState.groups.modified = Math.round(Math.random() * 100000);
                console.log("new state because of update group layout", newState);

                return newState;
            } else {
                console.log("Couldn't add concept, got ",action.payload.status);
                return state;
            }

        default:
            return state;
    }
}

