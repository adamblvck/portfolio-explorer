import axios from 'axios';

export const ADD_GROUP = 'add_group';
export const EDIT_GROUP = 'edit_group';
export const DELETE_GROUP = 'delete_group';
export const UPDATE_GROUP_LAYOUT = 'update_group_layout';

const isLOCALHOST = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const ROOT_URL = isLOCALHOST ? 'http://localhost:4000/graphql' : '/graphql';

export function addGroup(groupInfo) {
    let query = `
    mutation addGroup(
        $name:String,
        $description:String,
        $n_depth:Int,
        $parent_groupId:ID,
        $board_id:ID,
        $_boardId:ID
        $color:String,
        $background:String,
    ){
        addGroup(name:$name, 
            description:$description,n_depth:$n_depth,
            parent_groupId:$parent_groupId,
            board_id:$board_id, _boardId:$_boardId, color:$color,
            background:$background){
                id
                name
                color
                background
                description
                n_depth
                parent_groupId
                board_id
                _boardId
                board {
                    id
                    board_id
                    group_layouts {
                        name
                        layout
                    }
                }
                concept_layouts {
                    name
                    layout
                }
                parent_group {
                    id
                    group_layouts {
                        name
                        layout
                    }
                }
        }
    }`;

    const headers = {
        Authorization: localStorage.getItem('id_token'),
        'content-type': 'application/json'
    }

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data:{
            query: query,
            variables: groupInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: ADD_GROUP,
        payload: request
    }
}

export function editGroup(groupInfo) {
    let query = `
    mutation editGroup(
        $id:ID!,
        $name:String,
        $sector:String,
        $color:String,
        $background:String,
        $description:String,
        $n_depth:Int,
        $parent_groupId:ID,
        $board_id:ID,
        $_boardId:ID
    ){
        updateGroup(id:$id,name:$name,color:$color, 
            background:$background, sector:$sector, 
            description:$description,n_depth:$n_depth,
            parent_groupId:$parent_groupId,
            board_id:$board_id, _boardId:$_boardId){
                id
                name
                color # used for subgroup-title color
                description
                n_depth # needed for group editing, in case when needed
                parent_groupId # needed for group editing, in case when needed
                board_id # needed for board hierarchymn
                _boardId # Database ID of parent Board
                concept_layouts {
                    name
                    layout
                }
    }}`;
    
    const headers = {
        Authorization: localStorage.getItem('id_token'),
        'content-type': 'application/json'
    }

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data:{
            query: query,
            variables: groupInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: EDIT_GROUP,
        payload: request
    }
}

export function deleteGroup(groupInfo) {
    let query = `
    mutation deleteGroup (
        $id:ID!
    ) {
        deleteGroup(
            id:$id
        ) { 
            id
            parent_groupId
            board {
                group_layouts {
                    name
                    layout
                }
            }
            parent_group {
                id
                group_layouts {
                    name
                    layout
                }
            }
            concept_layouts {
                name
                layout
            }
        }
    }
    `;

    const headers = {
        Authorization: localStorage.getItem('id_token'),
        'content-type': 'application/json'
    }

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data:{
            query: query,
            variables: groupInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: DELETE_GROUP,
        payload: request
    }
}

export function updateGroupLayout(groupInfo) {
    let query = `
    mutation updateGroupLayout (
        $id:ID!,
        $group_layouts: [LayoutInput]
    ) {
        updateGroup (
            id:$id,
            group_layouts:$group_layouts
        ) { 
            id
            parent_groupId
            group_layouts {
                name
                layout
            }
        }
    }`;

    const headers = {
        Authorization: localStorage.getItem('id_token'),
        'content-type': 'application/json'
    }

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data:{
            query: query,
            variables: groupInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: UPDATE_GROUP_LAYOUT,
        payload: request
    }
}