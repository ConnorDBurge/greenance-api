const { merge } = require('lodash')

const { userTypeDefs, userResolvers } = require('./user')
const { plaidTypeDefs, plaidResolvers } = require('./plaid')

const typeDefs = [
    userTypeDefs,
    plaidTypeDefs,
]

const resolvers = merge({},
    userResolvers,
    plaidResolvers
)

module.exports = { typeDefs, resolvers }