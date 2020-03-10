import axios from 'axios';

export const SHOW_CONCEPT_DETAIL = 'show_concept_detail';
export const CLOSE_CONCEPT_DETAIL = 'close_concept_detail';
export const FETCH_AND_SHOW_CONCEPT_DETAIL = 'fetch_and_show_concept_detail';

export const ADD_CONCEPT = 'add_concept';
export const UPDATE_CONCEPT = 'update_concept';
export const DELETE_CONCEPT = 'delete_concept';

// Local development has a different url than when deployed on heroku
const isLOCALHOST = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const ROOT_URL = isLOCALHOST ? 'http://localhost:4000/graphql' : '/graphql';

export function showConceptDetail(concept) {
    return {
        type: SHOW_CONCEPT_DETAIL,
        payload: concept
    }
}

export function closeConceptDetail() {
    return {
        type: CLOSE_CONCEPT_DETAIL,
        payload: {}
    }
}

export function addConcept(conceptInfo) {
    let query = `
        mutation addConcept (
            $name:String,
            $logo_url: String,
            $meta: MetaInput,
            $markdown: String,
            $details: ConceptDetailInput,
            $groupIds: [String]
        ) {
            addConcept(
                name:$name,
                logo_url:$logo_url,
                meta:$meta,
                markdown:$markdown,
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
                markdown
                details {
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
                    concept_layouts {
                        name
                        layout
                    }
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
        $markdown: String,
        $details: ConceptDetailInput,
        $groupIds: [String]
    ) {
        updateConcept(
            id:$id,
            name:$name,
            logo_url:$logo_url,
            meta:$meta,
            markdown:$markdown,
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
            markdown
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

// Not used, but good to have for reference
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