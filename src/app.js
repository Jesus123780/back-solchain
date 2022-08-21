import express from 'express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { execute, subscribe } from 'graphql'
import jwt from 'jsonwebtoken'
import { createServer } from 'node:http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import resolvers from '../src/lib/resolvers'
import typeDefs from '../src/lib/typeDefs'
require('dotenv').config();

(async () => {
    // config ports
    const GRAPHQL_PORT = 3002
    const API_REST_PORT = 3003
    // Initialization apps
    const app = express()
    // Routes
    app.set('port', process.env.GRAPHQL_PORT || 3003)
    app.post('/image', (req, res) => { res.json('/image api') })
    // Listen App
    app.listen(API_REST_PORT, () => {
        console.log('API SERVER LISTENING ON PORT', API_REST_PORT)
    })
    // Middleware
    app.use(express.json({ limit: '50mb' }))
    const httpServer = createServer(app)
    const schema = makeExecutableSchema({ typeDefs, resolvers })
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        persistedQueries: true,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        context: async ({ req, res }) => {
            const device = req.headers.device
            const NEXT_APP_ADMIN = process.env.NEXT_APP_ADMIN
            const NEXT_APP_CLIENT = process.env.NEXT_APP_ADMIN
            try {
                const token = req.headers.authorization?.split(' ')[1]
                if (token && token !== null && token !== undefined) {
                    try {
                        // validate user in client.
                        const User = await jwt.verify(token, process.env.NODE_AUT_SECRET)
                        return {
                            device,
                            NEXT_APP_ADMIN,
                            NEXT_APP_CLIENT,
                            res,
                            User
                        }
                    } catch (err) {
                        console.log(err, 'CONTEXT ERROR')
                    }
                } else {
                    return {
                        device,
                        NEXT_APP_ADMIN,
                        NEXT_APP_CLIENT,
                        res
                    }
                }
            } catch (error) {
                console.log(error, 'Final Error')
            }
        }
    })
    await server.start()
    server.applyMiddleware({ app })
    SubscriptionServer.create({ schema, execute, subscribe }, { server: httpServer, path: server.graphqlPath })
    httpServer.listen(GRAPHQL_PORT || 3003, () => {
        console.log(`🚀 Query endpoint ready at http://localhost:${ GRAPHQL_PORT }`)
        console.log(`🚀 Subscription endpoint ready at ws://localhost:${ GRAPHQL_PORT }${ server.graphqlPath }`)
    })
})()