const { RESTDataSource } = require('apollo-datasource-rest')
const { Configuration, PlaidApi, PlaidEnvironments, AuthGetRequest } = require('plaid')

const { getAccessToken, setAccessToken } = require('./secrets.js')

class Plaid extends RESTDataSource {
    constructor() {
        super()
        this.PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID
        this.PLAID_SECRET = process.env.PLAID_SECRET
        this.PLAID_ENV = process.env.PLAID_ENV || 'sandbox'
        this.PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(',',)
        this.PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(',',)
        this.PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || ''
        this.ITEM_ID = null
        this.client = null
        this.configure()
    }

    configure() {
        const configuration = new Configuration({
            basePath: PlaidEnvironments[this.PLAID_ENV],
            baseOptions: {
                headers: {
                    'PLAID-CLIENT-ID': this.PLAID_CLIENT_ID,
                    'PLAID-SECRET': this.PLAID_SECRET,
                    'Plaid-Version': '2020-09-14',
                },
            },
        })
        this.client = new PlaidApi(configuration)
    }

    getInfo() {
        return {
            item_id: this.ITEM_ID,
            access_token: this.ACCESS_TOKEN,
            products: this.PLAID_PRODUCTS,
        }
    }

    async createLinkToken() {
        const configs = {
            user: {
                client_user_id: 'user-id',
            },
            client_name: 'Plaid Quickstart',
            products: this.PLAID_PRODUCTS,
            country_codes: this.PLAID_COUNTRY_CODES,
            language: 'en',
        }
        if (this.PLAID_REDIRECT_URI !== '') {
            configs.redirect_uri = this.PLAID_REDIRECT_URI
        }
        const { data } = await this.client.linkTokenCreate(configs)
        return data
    }

    async exchangePublicToken(args) {
        const { public_token } = args
        const { data } = await this.client.itemPublicTokenExchange({ public_token })
        setAccessToken(data?.access_token)
        return { message: 'Successful public token exchange', item_id: data?.item_id, error: null }
    }

    async getAuthInfo(args) {
        const { data } = await this.client.authGet({ access_token: getAccessToken() })
        return { accounts: data?.accounts }
    }
}

module.exports = Plaid