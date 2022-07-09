const { gql } = require('apollo-server-express')

const userTypeDefs = gql`
    type Query {
        user: User
    }

    type User {
        id: String
    }
`
const userResolvers = {
    Query: {
        user: async (_, __, { dataSources }) => {
            return dataSources.user.getUser()
        }
    }
}

module.exports = { userTypeDefs, userResolvers }