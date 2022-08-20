import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import express from 'express'
import { createServer } from 'node:http'
import jwt from 'jsonwebtoken'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import typeDefs from '../src/lib/typeDefs'
import resolvers from '../src/lib/resolvers'

require('dotenv').config();
(async () => {
  // config ports
  const GRAPHQL_PORT = 4000
  const API_REST_PORT = 5000
  // Initialization apps
  const app = express()
  // Routes
  app.set('port', process.env.GRAPHQL_PORT || 4000)

  app.post('/image', (req, res) => { res.json('/image api') })
  // Listen App
  app.listen(API_REST_PORT, () => {
    console.log('API SERVER LISTENING ON PORT', API_REST_PORT)
  })
  // const resolvers = {
  //   Query: {
  //     books: () => books,
  //     usuario: () => {
  //       const todo = 'Juan  Perez'
  //       return {
  //         lastName: 'Perez',
  //         name: todo
  //       }
  //     }

  //   }
  // }

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
      const url = 'http://localhost:3001/app/api/graphql'
      try {
        const token = (req.headers.authorization?.split(' ')[1])
        const { body } = req || {}
        const { variables } = body || {}
        const store = variables.to || ''
        console.log(process.env.NODE_AUT_SECRET, 8)
        if (token !== 'null') {
          try {
            // validate user in client.
            const User = await jwt.verify(token || '', process.env.NODE_AUT_SECRET)
            // let User = null
            return { User, res, ADMIN_APP: url, store }
          } catch (err) {
            console.log(err)
            console.log('CONTEXT ERROR')
          }
        } else { return { ADMIN_APP: url } }
      } catch (error) {
        console.log(error, 'finalERROR')
      }
    }
  })
  await server.start()
  server.applyMiddleware({ app })
  SubscriptionServer.create({ schema, execute, subscribe }, { server: httpServer, path: server.graphqlPath })
  httpServer.listen(GRAPHQL_PORT || 4000, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${GRAPHQL_PORT}`)
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${GRAPHQL_PORT}${server.graphqlPath}`)
  })
})()
