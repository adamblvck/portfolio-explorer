import axios from 'axios';

export const ADD_BUBBLE = 'add_bubble';
export const EDIT_BUBBLE = 'edit_bubble';
export const DELETE_BUBBLE = 'delete_bubble';

// Local development has a different url than when deployed on heroku
const isLOCALHOST = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const ROOT_URL = isLOCALHOST ? 'http://localhost:4000/graphql' : '/graphql';

export function addBubble(bubbleInfo) {
    // FETCH_BUBBLES
    let query = `
    mutation addBubble (
        $name:String,
        $color: String,
        $background: String,
        $description: String,
    ) {
        addBubble(
            name:$name,
            color:$color,
            background:$background,
            description:$description
        ) {
            id
            name
            color
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

export function updateBubble(bubbleInfo) {
    // FETCH_BUBBLES
    let query = `
    mutation updateBubble (
        $id:ID!,
        $name:String,
        $color: String,
        $background: String,
        $description: String,
    ) {
        updateBubble(
            id:$id,
            name:$name,
            color:$color,
            background:$background,
            description:$description
        ) {
            id
            name
            color
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