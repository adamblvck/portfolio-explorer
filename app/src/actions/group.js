import axios from 'axios';

export const ADD_GROUP = 'add_group';
export const EDIT_GROUP = 'edit_group';
export const DELETE_GROUP = 'delete_group';


export function addGroup(groupInfo) {
    let query = `
    mutation addGroup(
        $name:String,
        $description:String,
        $n_depth:Int,
        $parent_groupId:ID,
        $bubble_id:ID,
        $color:String,
        $background:String
    ){
        addGroup(name:$name, 
            description:$description,n_depth:$n_depth,
            parent_groupId:$parent_groupId,
            bubble_id:$bubble_id, color:$color,
            background:$background){
                id
                name
                color
                background
                description
                n_depth
                parent_groupId
                bubble_id
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
        $bubble_id:ID
    ){
        updateGroup(id:$id,name:$name,color:$color, 
            background:$background, sector:$sector, 
            description:$description,n_depth:$n_depth,
            parent_groupId:$parent_groupId,
            bubble_id:$bubble_id){
                id
                name
                color # used for subgroup-title color
                description
                n_depth # needed for group editing, in case when needed
                parent_groupId # needed for group editing, in case when needed
                bubble_id # needed for bubble hierarchymn
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