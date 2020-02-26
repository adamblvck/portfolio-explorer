import axios from 'axios';

export const FETCH_BUBBLES = "fetch_bubbles";
export const FETCH_CONCEPTS = 'fetch_concepts';
export const FETCH_BUBBLE_GROUPS = 'fetch_bubble_groups';

export const FETCH_CRYPTO_PRICES = 'fetch_crypto';

// Local development has a different url than when deployed on heroku
const isLOCALHOST = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const ROOT_URL = isLOCALHOST ? 'http://localhost:4000/graphql' : '/graphql';

const CRYPTO_URL_BASE = 'https://min-api.cryptocompare.com/data/histoday?';
const CRYPTO_URL_END = '&tsym=USD&limit=60&aggregate=1&e=CCCAGG';

export function fetchBubbles() {
    // FETCH_BUBBLES
    const query = `
        query getBubbles {
            bubbles{
              id
              name
              bubble_id
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

// export function fetchBoard(board_id) {
//     const query = `
//     query getBubbleGroups {
//         bubble (bubble_id:"${board_id}"){
//             id
//             bubble_id
//             group_layouts {
//                 name
//                 layout
//             }
//             groups { # groups at n_depth = 0
//                 id
//                 name
//                 # used for background colors
//                 color
//                 # used for background gradients or pictures
//                 background 
//                 description
//                 # needed for group editing, in case when needed
//                 n_depth 
//                 # needed for group editing, in case when needed
//                 parent_groupId 
//                 # needed for top-level bubble_id
//                 bubble_id # needed for bubble hierarchymn
//                 group_layouts {
//                     name
//                     layout
//                 }
//                 groups { # n_depth = 1 (subgroups of group)
//                     id
//                     name
//                     color # used for subgroup-title color
//                     description
//                     n_depth # needed for group editing, in case when needed
//                     parent_groupId # needed for group editing, in case when needed
//                     bubble_id # used for bubble hierarchymn 
//                     concept_layouts {
//                         name
//                         layout
//                     }
//                     concepts {
//                         id
//                         name
//                         logo_url
//                         meta {
//                             color
//                             symbol
//                         }
//                         markdown
//                         details {
//                             summary
//                             mindmap
//                             short_copy
//                             reference_links {
//                                 name
//                                     url
//                             }
//                             trade_off {
//                                 pros
//                                 cons
//                             }
//                         } 
//                         groupIds
//                         group {
//                             id
//                             name
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     `;

//     const headers = {
//         Authorization: localStorage.getItem('id_token'),
//         'content-type': 'application/json'
//     }

//     const request = axios({
//         method:'post',
//         url:`${ROOT_URL}`,
//         data:{
//             query: query
//         },
//         headers: localStorage.getItem('is_authenticated')? headers: {}
//     });

//     return {
//         type: FETCH_BOARD,
//         payload: request//payload
//     }
// }

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