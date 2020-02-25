import axios from 'axios';

export const GETUSERINFO = 'get_user_info';
export const CREATEUSER = 'create_user';
export const CHECKUSERNAME = 'user_exists_query'

const isLOCALHOST = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const ROOT_URL = isLOCALHOST ? 'http://localhost:4000/graphql' : '/graphql';

export function getUserInfo(token) {
    let query = `
    query {
        user {
            id
            username
            email
        }
    }`;

    console.log("dispatched user token", token.idToken);

    const headers = {
        Authorization: token.idToken,
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

export function usernameAvailable(username){
    let query = `query { usernameavailable( username:"${username}" ) }`;

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
        type: CHECKUSERNAME,
        payload: request
    }
}

export function createUser(username){
    let query = `mutation { addUser( username:"${username}"){
        username
        email
        email_verified
        role
    } }`;

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
        type: CREATEUSER,
        payload: request
    }
}