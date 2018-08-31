export const FETCH_CONCEPTS = 'fetch_concepts';
export const SHOW_CONCEPT_DETAIL = 'show_concept_detail';

// mockup data
const payload = { data: {
    name: 'concept',
    groups: [
        // group 1
        {
            id: 'group1',
            name: 'Cryptocurrencies',
            sector: 'Finance',
            concepts: [
                {
                    id: 0,
                    name: 'Ethereum',
                    logo_url: 'https://www.ethereum.org/images/logos/ETHEREUM-LOGO_PORTRAIT_Black_small.png',
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
                    logo_url: 'https://www.freeiconspng.com/uploads/bitcoin-logo-transparent-png-13.png',
                    meta: {
                        color: 'orange'
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
        },
        {
            id: 'group3',
            name: 'FinTech',
            sector: 'FinTech',
            concepts: [
                {
                    id: 4,
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

export function fetchAndShowConceptDetails(conceptInfo) {
    console.log(conceptInfo);

    const payload = { ...conceptInfo, concept: {
        id: 0,
        name: 'Ethereum',
        logo_url: 'https://www.ethereum.org/images/logos/ETHEREUM-LOGO_PORTRAIT_Black_small.png',
        meta: {
            color: 'black'
        },
        details: {
            title: 'Ethereum',
            summary: 'Ethereum is a nice programmable blockchain',
            reference_links : [
                {
                    name: 'homepage',
                    url: 'https://www.ethereum.org/'
                }
            ]
        }
    }}

    return {
        type: SHOW_CONCEPT_DETAIL,
        payload: payload
    }
} 