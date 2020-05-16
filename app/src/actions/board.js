import axios from 'axios';

export const ADD_BOARD = 'add_board';
export const EDIT_BOARD = 'edit_board';
export const DELETE_BOARD = 'delete_board';
export const UPDATE_BOARD_LAYOUT = 'update_board_layout';
export const UPDATE_BOARD_SCOPE = 'update_board_scope';
export const FETCH_BOARD = 'fetch_board';

// Local development has a different url than when deployed on heroku
const isLOCALHOST = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const ROOT_URL = isLOCALHOST ? 'http://localhost:4000/graphql' : '/graphql';

export function addBoard(boardInfo) {
    let query = `
    mutation addBoard (
        $name:String,
        $board_id: String,
        $background: String,
        $description: String
    ) {
        addBoard(
            name:$name,
            board_id:$board_id,
            background:$background,
            description:$description
        ) {
            id
            name
            board_id
            background
            description
            scope
        }
    }`;

    const headers = {
        Authorization: localStorage.getItem('id_token'),
        'content-type': 'application/json'
    }

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data: {
            query: query,
            variables: boardInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: ADD_BOARD,
        payload: request
    };
}

export function updateBoardLayout(boardInfo) {
    // UPDATE_BOARD_LAYOUT
    let query = `
    mutation updateBoardLayout (
        $id: ID!,
        $group_layouts: [LayoutInput]
    ) {
        updateBoardLayout(
            id:$id,
            group_layouts:$group_layouts
        ) {
            id
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
        data: {
            query: query,
            variables: boardInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: UPDATE_BOARD_LAYOUT,
        payload: request
    };
}

export function fetchBoard(boardId, scope) { // pass board id, as stored in database
    const query = `
    query getBoardGroups {
        board (id:"${boardId}", scope:"${scope}"){
            id
            board_id
            background
            name
            description
            scope
            group_layouts {
                name
                layout
            }
            groups { # groups at n_depth = 0
                id
                name
                # used for background colors
                # used for background gradients or pictures
                background 
                description
                # needed for group editing, in case when needed
                n_depth 
                # needed for group editing, in case when needed
                parent_groupId 
                # needed for top-level board_id
                board_id # needed for board hierarchymn
                _boardId
                group_layouts {
                    name
                    layout
                }
                groups { # n_depth = 1 (subgroups of group)
                    id
                    name
                    color # used for subgroup-title color
                    description
                    n_depth # needed for group editing, in case when needed
                    parent_groupId # needed for group editing, in case when needed
                    board_id # used for board hierarchy
                    _boardId
                    concept_layouts {
                        name
                        layout
                    }
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
                }
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
            query: query
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: FETCH_BOARD,
        payload: request//payload
    }
}

export function updateBoard(boardInfo) {
    let query = `
    mutation updateBoard (
        $id: ID!,
        $name: String,
        $board_id: String,
        $background: String,
        $description: String,
    ) {
        updateBoard (
            id:$id,
            name:$name,
            board_id:$board_id,
            background:$background,
            description:$description
        ) {
            id
            name
            board_id
            background
            description
            scope
        }
    }`;

    const headers = {
        Authorization: localStorage.getItem('id_token'),
        'content-type': 'application/json'
    }

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data: {
            query: query,
            variables: boardInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: EDIT_BOARD,
        payload: request
    };
}

export function updateBoardScope(boardInfo) {
    let query = `
    mutation updateBoardScope (
        $id: ID!,
        $scope: String!
    ) {
        updateBoardScope (
            id:$id,
            scope:$scope
        ) {
            id
            name
            board_id
            background
            description
            scope
        }
    }`;

    const headers = {
        Authorization: localStorage.getItem('id_token'),
        'content-type': 'application/json'
    }

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data: {
            query: query,
            variables: boardInfo
        },
        headers: localStorage.getItem('is_authenticated') ? headers : {}
    });

    return {
        type: UPDATE_BOARD_SCOPE,
        payload: request
    };
}

export function deleteBoard(boardInfo){
    let query = `
    mutation deleteBoard (
        $id:ID!
    ) {
        deleteBoard (
            id:$id
        ) {
            id
        }
    }`;

    const headers = {
        Authorization: localStorage.getItem('id_token'),
        'content-type': 'application/json'
    }

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data: {
            query: query,
            variables: {id: boardInfo.id}
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });
 
    return {
        type: DELETE_BOARD,
        payload: request
    };
}