import _ from 'lodash';
import { FETCH_CONCEPTS, FETCH_ROOT_GROUPS_AND_CONCEPTS, ADD_GROUP, EDIT_GROUP, DELETE_GROUP} from '../actions';

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

export default function (state = {}, action) {

    switch(action.type) {
        case FETCH_CONCEPTS:
            return _.mapKeys(action.payload.data.data.groups, 'id');
        case FETCH_ROOT_GROUPS_AND_CONCEPTS:
            return mapKeysRecursive(action.payload.data.data.root_groups);
        case ADD_GROUP:
            if (action.payload.status == 200){
                window.location.reload(); // cheap trick, needs to replaced !
            }
        case EDIT_GROUP:
            if (action.payload.status == 200){
                window.location.reload(); // cheap trick, needs to replaced !
            }
        case DELETE_GROUP:
            if (action.payload.status == 200){
                window.location.reload(); // cheap trick, needs to replaced !
            }
        default:
            return state;
    }
}
