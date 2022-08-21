import dateTimeScalar from '../CustomScalar'
import user from '../resolvers/user'

export default {
    DateTime: dateTimeScalar,
    // Upload: GraphQLUpload,
    Query: {
        ...user.QUERIES
    },
    Mutation: {
    }
}