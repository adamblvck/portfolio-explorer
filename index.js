/*
  Author: Adam Blvck (adamblvck.com)
  Product: Blockchain Ecosystem Explorer
  Year: 2018
  Smartie.be
*/

const hapi = require('hapi');
const mongoose = require('mongoose');

const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const schema = require('./graphql/schema');

const dbuser = 'admin';
const dbpwd = '***REMOVED***';
const MONGO_URI = `mongodb://${dbuser}:${dbpwd}@ds237192.mlab.com:37192/concept-db`;

const Path = require('path')
const Inert = require('inert');

const server = hapi.server({
    port: process.env.PORT || 4000,
    host: 'localhost'
});

mongoose.connect(MONGO_URI);

mongoose.connection.once('open', () => {
    console.log('connected to mlab database');
})

const init = async() => {

    // register GraphiQL, points to /graphql
    await server.register({
        plugin: graphiqlHapi,
        options: {
            path: '/graphiql',
            graphiqlOptions: {
                endpointURL: '/graphql'
            },
            route: { cors: true }
        }
    });

    // register GraphQL
    await server.register({
        plugin: graphqlHapi,
        options: {
            path: '/graphql',
            graphqlOptions: {
                schema
            },
            route: { cors: true }
        }
    });

    // register static file serving (REACT)
    await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: {
          directory: {
            path: Path.join(__dirname, 'app'),
            listing: false,
            index: true
          }
        }
    })

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

init();