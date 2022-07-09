const { ApolloServer } = require('apollo-server-express')
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const moment = require('moment');
const util = require('util');
require('dotenv').config()

const { typeDefs, resolvers } = require('./schema')
const { User, Plaid } = require('./services')

const PORT = process.env.PORT || 2311

const expressed = async ({ PORT }) => {
    const app = express()
    app.use(
        bodyParser.urlencoded({
            extended: false,
        }),
    );
    app.use(bodyParser.json());
    app.use(cors());

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => {
            return {
                user: new User(),
                plaid: new Plaid()
            }
        }
    })

    await server.start()
    server.applyMiddleware({ app, path: '/graphql' })

    app.listen({ port: PORT }, () => {
        console.log(`GraphQL server started at http://localhost:${PORT}${server.graphqlPath}`)
    })
}
expressed({ PORT })