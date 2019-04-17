import axios from 'axios';

// action types
export const FETCH_CRYPTO_PRICES = 'fetch_crypto'

export const FETCH_BUBBLES = "fetch_bubbles";
export const FETCH_CONCEPTS = 'fetch_concepts';
export const FETCH_ROOT_GROUPS_AND_CONCEPTS = 'fetch_rootgroup_and_concepts';
export const FETCH_BUBBLE_GROUPS = 'fetch_bubble_groups';

export const SHOW_CONCEPT_DETAIL = 'show_concept_detail';
export const FETCH_AND_SHOW_CONCEPT_DETAIL = 'fetch_and_show_concept_detail';

export const ADD_CONCEPT = 'add_concept';
export const UPDATE_CONCEPT = 'update_concept';
export const DELETE_CONCEPT = 'delete_concept';

export const ADD_GROUP = 'add_group';
export const EDIT_GROUP = 'edit_group';
export const DELETE_GROUP = 'delete_group';

// Local development has a different url than when deployed on heroku
const isLOCALHOST = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const ROOT_URL = isLOCALHOST ? 'http://localhost:4000/graphql' : '/graphql';

const CRYPTO_URL_BASE = 'https://min-api.cryptocompare.com/data/histoday?';
const CRYPTO_URL_END = '&tsym=USD&limit=60&aggregate=1&e=CCCAGG';

export function fetchCryptoPrices(symbol) {
    const url = `${CRYPTO_URL_BASE}fsym=${symbol}${CRYPTO_URL_END}`;

    const request = axios({
        method:'post',
        url: url
    });

    return {
        type: FETCH_CRYPTO_PRICES,
        payload: request
    }
}

export function fetchBubbles() {
    // FETCH_BUBBLES
    const query = `
        query getBubbles {
            bubbles{
              id
              name
              color
              background
              description
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
        data: {
            query: query
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: FETCH_BUBBLES,
        payload: request
    };
}

export function fetchBubbleGroups(bubble_id) {
    const query = `
    query getBubbleGroups {
        bubble_groups (bubble_id:"${bubble_id}") { # n_depth = 0
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
            groups { # n_depth = 1 (subgroups of group)
                id
                name
                color # used for subgroup-title color
                description
                n_depth # needed for group editing, in case when needed
                parent_groupId # needed for group editing, in case when needed
                bubble_id # used for bubble hierarchymn 
                concepts {
                    id
                    name
                    logo_url
                    meta {
                        color
                        symbol
                    }
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
        type: FETCH_BUBBLE_GROUPS,
        payload: request//payload
    }
}

export function fetchCoreGroups() {
    const query = `
    query getAllGroupsAndConcepts {
        root_groups { # n_depth = 0
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
            bubble_id
            groups { # n_depth = 1
                id
                name
                color # used for subgroup-title color
                description
                n_depth # needed for group editing, in case when needed
                parent_groupId # needed for group editing, in case when needed
                bubble_id # needed for bubble hierarchymn 
                concepts {
                    id
                    name
                    logo_url
                    meta {
                        color
                        symbol
                    }
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
        type: FETCH_ROOT_GROUPS_AND_CONCEPTS,
        payload: request//payload
    }
}

export function showConceptDetail(concept) {
    return {
        type: SHOW_CONCEPT_DETAIL,
        payload: concept
    }
}

export function fetchAndShowConceptDetails(conceptInfo) {
    let query = `
        query getConceptDetails {
            concept(id:"${conceptInfo.conceptId}") {
                id
                name
                logo_url
                meta {
                    color
                    symbol
                }
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
                group {
                    id
                    name
                }
                groupIds
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
        type: FETCH_AND_SHOW_CONCEPT_DETAIL,
        payload: request,
        meta: conceptInfo
    }
}

export function addConcept(conceptInfo) {
    let query = `
        mutation addConcept (
            $name:String,
            $logo_url: String,
            $meta: MetaInput,
            $details: ConceptDetailInput,
            $groupIds: [String]
        ) {
            addConcept(
                name:$name,
                logo_url:$logo_url,
                meta:$meta,
                details:$details,
                groupIds:$groupIds
            ) {
                id
                name
                logo_url
                meta {
                    color
                    symbol
                }
                details{
                    summary
                    mindmap
                    short_copy
                    reference_links {
                        name
                        url
                    }
                }
                group {
                    id
                    name
                    parent_groupId
                }
                groupIds
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
            variables: conceptInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: ADD_CONCEPT,
        payload: request
    }
}

export function updateConcept(updatedConceptInfo) {
    let query = `
    mutation updateConcept (
        $id:ID!,
        $name:String,
        $logo_url: String,
        $meta: MetaInput,
        $details: ConceptDetailInput,
        $groupIds: [String]
    ) {
        updateConcept(
            id:$id,
            name:$name,
            logo_url:$logo_url,
            meta:$meta,
            details:$details,
            groupIds:$groupIds
        ) {
            id
            name
            logo_url
            meta {
                color
                symbol
            }
            details{
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
            group {
                id
                name
            }
            groupIds
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
            variables: updatedConceptInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: UPDATE_CONCEPT,
        payload: request
    }
}

export function deleteConcept(conceptInfo) {
    let query = `
    mutation deleteConcept (
        $id:ID!
    ) {
        deleteConcept(
            id:$id
        ) { 
            id
            group {
                id
                name
                parent_groupId
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
            variables: conceptInfo
        },
        headers: localStorage.getItem('is_authenticated')? headers: {}
    });

    return {
        type: DELETE_CONCEPT,
        payload: request
    }
}

export function addGroup(groupInfo) {
    let query = `
    mutation addGroup(
        $name:String,
        $sector:String,
        $description:String,
        $n_depth:Int,
        $parent_groupId:ID
    ){
        addGroup(name:$name,sector:$sector, 
            description:$description,n_depth:$n_depth,
            parent_groupId:$parent_groupId){
                id
                name
                color
                description
                n_depth
                parent_groupId
                bubble_id
    }}
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
        ) { id }
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