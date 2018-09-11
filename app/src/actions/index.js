import axios from 'axios';

// action types
export const FETCH_CONCEPTS = 'fetch_concepts';
export const FETCH_ROOT_GROUPS_AND_CONCEPTS = 'fetch_rootgroup_and_concepts';
export const SHOW_CONCEPT_DETAIL = 'show_concept_detail';
export const ADD_CONCEPT = 'add_concept';
export const UPDATE_CONCEPT = 'update_concept';
export const DELETE_CONCEPT = 'delete_concept';
export const ADD_GROUP = 'add_group';

const ROOT_URL = 'http://localhost:4000/graphql'

export function fetchCoreGroups() {
    let query = `
        query getAllGroupsAndConcepts {
            root_groups { # n_depth = 0
                id
                name
                sector
                description
                groups { # n_depth = 1
                    id
                    name
                    sector
                    description
                    concepts {
                        id
                        name
                        logo_url
                        details {
                            title
                            summary
                            reference_links {
                                name
                                url
                            }
                        }
                    }
                }
            }
        }
    `;

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data:{
            query: query
        }
    });

    return {
        type: FETCH_ROOT_GROUPS_AND_CONCEPTS,
        payload: request//payload
    }
}

export function fetchConcepts() {
    let query = `
        query getGroupsAndConcepts {
            groups {
                id
                name
                sector
                description
                concepts {
                    id
                    name
                    logo_url
                    details {
                        title
                        summary
                        reference_links {
                            name
                            url
                        }
                    }
                }
            }
        }
    `;

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data:{
            query: query
        }
    });

    return {
        type: FETCH_CONCEPTS,
        payload: request//payload
    }
}

export function fetchAndShowConceptDetails(conceptInfo) {
    let query = `
        query getConceptDetails {
            concept(id:"${conceptInfo.conceptId}") {
                id
                name
                logo_url
                details {
                    title
                    summary
                    reference_links {
                        name
                        url
                    }
                }
                group {
                    id
                    name
                }
            }
        }
    `;

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data:{
            query: query
        }
    });

    return {
        type: SHOW_CONCEPT_DETAIL,
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
            $groupId: String
        ) {
            addConcept(
                name:$name,
                logo_url:$logo_url,
                meta:$meta,
                details:$details,
                groupId:$groupId
            ) {
                id
                name
                logo_url
                meta {
                    color
                }
                details{
                    title
                    summary
                    reference_links {
                    name
                    url
                    }
                }
                group {
                    id
                    sector
                    name
                }
            }
        }
    `;

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data:{
            query: query,
            variables: conceptInfo
        }
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
        $groupId: String
    ) {
        updateConcept(
            id:$id,
            name:$name,
            logo_url:$logo_url,
            meta:$meta,
            details:$details,
            groupId:$groupId
        ) {
            id
            name
            logo_url
            meta {
                color
            }
            details{
                title
                summary
                reference_links {
                name
                url
                }
            }
            group {
                id
                sector
                name
            }
        }
    }
    `;

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data:{
            query: query,
            variables: updatedConceptInfo
        }
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
        ) { id }
    }
    `;

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data:{
            query: query,
            variables: conceptInfo
        }
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
        addGroup(name:$name,sector:$sector, description:$description,n_depth:$n_depth,parent_groupId:$parent_groupId){
            name
    }}
    `;

    const request = axios({
        method:'post',
        url:`${ROOT_URL}`,
        data:{
            query: query,
            variables: groupInfo
        }
    });

    return {
        type: ADD_GROUP,
        payload: request
    }
}