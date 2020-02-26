import _ from 'lodash';

import { FETCH_BUBBLES } from '../actions/fetching_public';
import { ADD_BUBBLE, EDIT_BUBBLE, DELETE_BUBBLE, FETCH_BOARD, UPDATE_BOARD_LAYOUT} from '../actions/board';

function mapKeysRecursive(root_groups){
    // goes into subgroups of every groups and performs another id sorting thingy on it :)
    var all_concepts = {};

    const hmm = root_groups;

    console.log('groups reducer', hmm);

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
        console.log(action.payload);
        return state;
    }

    switch(action.type) {
        case FETCH_BOARD:
            if (action.payload.status == 200 && action.payload.data){

                console.log(action.payload.data.data.bubble);

                const reduced = {
                    id: action.payload.data.data.bubble.id,
                    bubble_id: action.payload.data.data.bubble.bubble_id,
                    group_layouts: _.mapKeys(action.payload.data.data.bubble.group_layouts, 'name'),
                    groups: mapKeysRecursive(action.payload.data.data.bubble.groups)
                }
                
                return reduced;
            }
            else
                return state;

        case UPDATE_BOARD_LAYOUT:
            if (action.payload.status == 200 && action.payload.data){

                console.log("UDPATE_BOARD_LAYOUT", action.payload.data.data.updateBubble);

                const reduced = {
                    ...state,
                    group_layouts: _.mapKeys(action.payload.data.data.updateBubble.group_layouts, 'name'),
                }
                
                return reduced;
            }
            else
                return state;


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

