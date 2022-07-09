const { gql } = require('apollo-server-express');

const plaidTypeDefs = gql`

    type AuthInfo {
        accounts: [BankAccount]
    }

    type Balance {
        available: Float
        current: Float
        limit: Float
        iso_currency_code: String
        unofficial_currency_code: String
    }

    type BankAccount {
        account_id: String
        balances: Balance
        mask: String
        name: String
        official_name: String
        subtype: String
        type: String
    }

    type PlaidAccessToken {
        message: String
        item_id: String
        error: String
    }

    type PlaidInfo {
        item_id: String
        access_token: String
        products: [String]
    }

    type PlaidLinkToken {
        link_token: String
        expiration: String
        request_id: String
    }

    extend type Query {
        plaidInfo: PlaidInfo!
        createLinkToken: PlaidLinkToken!
        authInfo: AuthInfo
    }

    type Mutation {
        exchangePublicToken(public_token: String!): PlaidAccessToken!
    }

`

const plaidResolvers = {
    Query: {
        plaidInfo: (_, args, { dataSources }) => {
            return dataSources.plaid.getInfo()
        },
        createLinkToken: async (_, args, { dataSources }) => {
            return dataSources.plaid.createLinkToken()
        },
        authInfo: async (_, args, { dataSources }) => {
            return dataSources.plaid.getAuthInfo()
        }
    },
    Mutation: {
        exchangePublicToken: async (_, args, { dataSources }) => {
            return dataSources.plaid.exchangePublicToken(args)
        }
    }
}

module.exports = { plaidTypeDefs, plaidResolvers }