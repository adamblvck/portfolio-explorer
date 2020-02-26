import axios from 'axios';

export const ADD_BUBBLE = 'add_bubble';
export const EDIT_BUBBLE = 'edit_bubble';
export const DELETE_BUBBLE = 'delete_bubble';
export const UPDATE_BOARD_LAYOUT = 'UPDATE_BUBBLE_LAYOUT';
export const FETCH_BOARD = 'fetch_board';

// Local development has a different url than when deployed on heroku
const isLOCALHOST = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const ROOT_URL = isLOCALHOST ? 'http://localhost:4000/graphql' : '/graphql';

export function addBubble(bubbleInfo) {
    // FETCH_BUBBLES
    let query = `
    mutation addBubble (
        $name:String,
        $bubble_id: String,
        $background: String,
        $description: String,
    ) {
        addBubble(
            name:$name,
            bubble_id:$bubble_id,
            background:$background,
            description:$description
        ) {
            id
            name
            bubble_id
            background
            description
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
            variables: bubbleInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: ADD_BUBBLE,
        payload: request
    };
}

export function updateBoardLayout(bubbleInfo) {
    // UPDATE_BOARD_LAYOUT
    let query = `
    mutation updateBoardLayout (
        $id: ID!,
        $group_layouts: [LayoutInput]
    ) {
        updateBubble(
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
            variables: bubbleInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: UPDATE_BOARD_LAYOUT,
        payload: request
    };
}

export function fetchBoard(board_id) {
    const query = `
    query getBubbleGroups {
        bubble (bubble_id:"${board_id}"){
            id
            bubble_id
            group_layouts {
                name
                layout
            }
            groups { # groups at n_depth = 0
                id
                name
                # used for background colors
                color
                # used for background gradients or pictures
                background 
                description
                # needed for group editing, in case when needed
                n_depth 
                # needed for group editing, in case when needed
                parent_groupId 
                # needed for top-level bubble_id
                bubble_id # needed for bubble hierarchymn
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
                    bubble_id # used for bubble hierarchymn 
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

export function updateBubble(bubbleInfo) {
    // FETCH_BUBBLES
    let query = `
    mutation updateBubble (
        $id: ID!,
        $name: String,
        $bubble_id: String,
        $background: String,
        $description: String,
    ) {
        updateBubble(
            id:$id,
            name:$name,
            bubble_id:$bubble_id,
            background:$background,
            description:$description
        ) {
            id
            name
            bubble_id
            background
            description
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
            variables: bubbleInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: EDIT_BUBBLE,
        payload: request
    };
}

export function deleteBubble(bubbleInfo){
    // FETCH_BUBBLES
    let query = `
    mutation deleteBubble (
        $id:ID!
    ) {
        deleteBubble(
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
            variables: {id: bubbleInfo.id}
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });
 
    return {
        type: DELETE_BUBBLE,
        payload: request
    };
}