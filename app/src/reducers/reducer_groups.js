import _ from 'lodash';
import { FETCH_CONCEPTS, FETCH_ROOT_GROUPS_AND_CONCEPTS, ADD_GROUP} from '../actions';

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
            // console.log (mapKeysRecursive(action.payload.data.data.root_groups));
            return mapKeysRecursive(action.payload.data.data.root_groups);
        case ADD_GROUP:
            if (action.payload.status == 200){
                window.location.reload(); // cheap trick, needs to replaced !
            }
        default:
            return state;
    }
}
