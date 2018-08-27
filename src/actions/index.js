export const FETCH_CONCEPTS = 'fetch_concepts';

// mockup data
const payload = { data: {
    name: 'concept',
    groups: [
        // group 1
        {
            id: 'group1',
            name: 'Cryptocurrency',
            sector: 'Finance',
            concepts: [
                {
                    id: 0,
                    name: 'Ethereum',
                    logo_url: 'https://cgi.cryptoreport.com/images/coins/miota.svg',
                    meta: {
                        color: 'black'
                    },
                    details: {
                        title: 'Ethereum',
                        summary: 'Ethereum is a nice thing blockchain programmable',
                        reference_links : [
                            {
                                name: 'homepage',
                                url: 'https://www.ethereum.org/'
                            }
                        ]
                    }
                },
                {
                    id: 1,
                    name: 'Bitcoin',
                    logo_url: 'https://cgi.cryptoreport.com/images/coins/miota.svg',
                    meta: {
                        color: 'Orange'
                    },
                    details: {
                        title: 'Bitcoin',
                        summary: 'The first and currently the most popular coin in the world',
                        reference_links : [
                            {
                                name: 'homepage',
                                url: 'https://bitcoin.org/en/'
                            }
                        ]
                    }
                }
            ]
        },

        // group 2
        {
            id: 'group2',
            name: 'Internet of Things',
            sector: 'IoT',
            concepts: [
                {
                    id: 2,
                    name: 'IOTA',
                    logo_url: 'https://cdn-images-1.medium.com/max/1199/1*svz8GdU_bDAskObWCcsTCA.png',
                    meta: {
                        color: 'black'
                    },
                    details: {
                        title: 'IOTA',
                        summary: 'IOTA is a distributed ledger focusing on ...',
                        reference_links : [
                            {
                                name: 'homepage',
                                url: 'https://www.iota.org/'
                            }
                        ]
                    }
                }
            ]
        }
    ]
}};

export function fetchConcepts() {
    return {
        type: FETCH_CONCEPTS,
        payload: payload
    }
}