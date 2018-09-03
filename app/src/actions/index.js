import axios from 'axios';

// action types
export const FETCH_CONCEPTS = 'fetch_concepts';
export const SHOW_CONCEPT_DETAIL = 'show_concept_detail';
export const ADD_CONCEPT = "add_concept";

const ROOT_URL = 'http://localhost:4000/graphql'

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
    return {
        type: ADD_CONCEPT,
        payload: {}
    }
}