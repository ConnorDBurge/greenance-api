const { RESTDataSource } = require('apollo-datasource-rest')

class User extends RESTDataSource {
    constructor() {
        super()
    }

    async getUser() {
        return { id: 'data.user' }
    }
}

module.exports = User