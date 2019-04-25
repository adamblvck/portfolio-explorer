import axios from 'axios';

export const GETUSERINFO = 'get_user_info';
export const CREATEUSER = 'create_user';

const isLOCALHOST = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const ROOT_URL = isLOCALHOST ? 'http://localhost:4000/graphql' : '/graphql';

export function getUserInfo(token) {
    let query = `
    query {
        user {
            id
            display_name
            email
        }
    }`;

    console.log("dispatched!", token);

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
        type: GETUSERINFO,
        payload: request
    }
}

export function createUser(){
    

    return {
        type: CREATEUSER,
        payload: {}
    }
}