import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
const path = require('path')
const schemaDefsArray = loadFilesSync(
  path.join(__dirname, './types'),
  {
    recursive: true,
    extensions: ['gql', 'graphql']
  })

const typeDefs = mergeTypeDefs(schemaDefsArray)
// const typesArray = loadFilesSync('**/*.gql')

export default {
  ...typeDefs
}
