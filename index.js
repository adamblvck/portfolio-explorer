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

const hapiJWTAuth = require('hapi-auth-jwt2');
const jwksRSA = require('jwks-rsa');

const dbuser = 'admin';
const dbpwd = '***REMOVED***';
const MONGO_URI = `mongodb://${dbuser}:${dbpwd}@ds237192.mlab.com:37192/concept-db`;

const publicuser = 'public'
const publicpwd = '***REMOVED***'
const MONGO_PUBLIC_URI = `mongodb://${publicuser}:${publicpwd}@ds237192.mlab.com:37192/concept-db`;

const Path = require('path');

const server = hapi.server({
    port: process.env.PORT || 4000
});

mongoose.connect(MONGO_URI);

mongoose.connection.once('open', () => {
    console.log('connected to mlab database');
})

// bring your own validation function
const validateUser = function (decoded, request) {

    if (decoded && decoded.email) {
        return { isValid: true };
    }

    return { isValid: false };
};

const init = async() => {

    // register JWT authorization / verification for HAPI
    await server.register(hapiJWTAuth);

    server.auth.strategy('jwt', 'jwt', {
        complete: true,
        key: jwksRSA.hapiJwt2KeyAsync({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: 'https://blockchainexplorer.eu.auth0.com/.well-known/jwks.json' 
        }),
        validate: validateUser,
        verifyOptions: {
            audience: 'nmwFAcrQ4iKBlNNqjNuoFjzJwDMlkkJK', // Auth0 application ID
            issuer: 'https://blockchainexplorer.eu.auth0.com/', // Auth0 authentication endpoint
            algorithms: ['RS256']
        },
    });

    server.auth.default('jwt');

    // register GraphiQL, points to /graphql
    // await server.register({
    //     plugin: graphiqlHapi,
    //     options: {
    //         path: '/graphiql',
    //         graphiqlOptions: {
    //             endpointURL: '/graphql'
    //         },
    //         route: { cors: true }
    //     }
    // });

    // register GraphQL
    await server.register({
        plugin: graphqlHapi,
        options: {
            path: '/graphql',
            graphqlOptions: async (request) => {
                return {
                    schema,
                    context: request.auth
                }
            },
            // optional means that the request should have either a valid 
            // Authentication header, or none at all
            route: { cors: true, auth: { mode: 'optional' } }
        },
    });

    // register static file serving (REACT)
    await server.register(require('inert'));

    await server.route({
        method: 'GET',
        path: '/{path*}',
        handler: {
          directory: {
            path: Path.join(__dirname, 'app'),
            listing: false,
            index: true
          }
        },
        options: {
            auth: false
        }
    })

    server.ext('onPreResponse', (request, reply) => {
        let response = request.response;

        // if 404 - serve React app
        if (response.isBoom &&
            response.output.statusCode === 404) {
            return reply.file('./app/index.html');
        }

        return reply.continue;
    });

    error => {
        if (error) return next(error);
        server.log(['register', 'graphql', 'graphiql'], 'graphql plugins loaded successfully! 🎉');
        next();
      },

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

init();