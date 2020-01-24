/*
  Author: Adam Blvck (adamblvck.com)
  Product: Data Bubble
  Year: 2019
  Smartie.be
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

var ConceptSchema = new Schema({ 
    name: String,
    logo_url: String,
    meta: {
        color: String,
        symbol: String
    },
    markdown: String,
    details: {
        summary: String,
        mindmap: String,
        short_copy: String,
        reference_links: [ {
            name: String,
            url: String
        }],
        trade_off: {
            pros: [String],
            cons: [String],
        }
    },
    groupIds: [String]  // links to many group
});

module.exports = mongoose.model('Concept', ConceptSchema);

// Originally used data
// {
//     id: 0,
//     name: 'Ethereum',
//     logo_url: 'https://www.ethereum.org/images/logos/ETHEREUM-LOGO_PORTRAIT_Black_small.png',
//     meta: {
//         color: 'black'
//     },
//     details: {
//         title: 'Ethereum',
//         summary: 'Ethereum is a nice thing blockchain programmable',
//         reference_links : [
//             {
//                 name: 'homepage',
//                 url: 'https://www.ethereum.org/'
//             }
//         ]
//     }
// }