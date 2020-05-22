import axios from 'axios';

export const ADD_GROUP = 'add_group';
export const EDIT_GROUP = 'edit_group';
export const DELETE_GROUP = 'delete_group';
export const UPDATE_GROUP_LAYOUT = 'update_group_layout';
export const UPDATE_CONCEPT_LAYOUT = 'update_concept_layout';
export const UPDATE_CONCEPT_LAYOUT_SPECIAL = 'update_concept_layout_special';

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
        $display_option:String,
        $description:String,
        $n_depth:Int,
        $parent_groupId:ID,
        $board_id:ID,
        $_boardId:ID
    ){
        updateGroup(id:$id, name:$name, color:$color, 
            background:$background, sector:$sector, 
            description:$description, display_option:$display_option, n_depth:$n_depth,
            parent_groupId:$parent_groupId,
            board_id:$board_id, _boardId:$_boardId){
                id
                name
                background
                description
                display_option
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

export function updateConceptLayout(groupInfo) {
    let query = `
    mutation updateConceptLayout (
        $id:ID!,
        $concept_layouts: [LayoutInput]
    ) {
        updateGroup (
            id:$id,
            concept_layouts:$concept_layouts
        ) { 
            id
            parent_groupId
            concept_layouts {
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
        type: UPDATE_CONCEPT_LAYOUT,
        payload: request
    }
}

// this.props.updateConceptLayout_changegroup({
//     to_id: groupId,
//     to_concept_layouts: [layout],
//     from_id: groupId,
//     from_concept_layouts: [layout],
//     concept_id: dnd_results.payload,
// });

export function updateConceptLayout_changegroup(groupInfo) {
    let query = `
    mutation updateConceptLayouts (
        $to_id:ID!,
        $to_concept_layouts: [LayoutInput]!,
        $from_id:ID!,
        $from_concept_layouts: [LayoutInput]!,
        $concept_id: ID!
    ) {
        updateConceptLayout (
            to_id:$to_id,
            to_concept_layouts:$to_concept_layouts,
            from_id:$from_id,
            from_concept_layouts:$from_concept_layouts,
            concept_id:$concept_id
        ) { 
            id
            parent_groupId

            concepts {
                id
                name
                logo_url
                meta {
                    color
                    symbol
                }
                markdown
                details {
                    summary
                    mindmap
                    short_copy
                    reference_links {
                        name
                            url
                    }
                    trade_off {
                        pros
                        cons
                    }
                } 
                groupIds
                group {
                    id
                    name
                }
            }

            concept_layouts {
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
        type: UPDATE_CONCEPT_LAYOUT_SPECIAL,
        payload: request
    }
}