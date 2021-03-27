class User {
    constructor(username, password, type) {
        this.username = username
        this.password = password
        this.type = type
    }
}

class UserManager {
    dbcon
    constructor() {
        this.dbcon = undefined
    }

    async createConnection() {
        if (!this.dbcon) {
            this.dbcon = await connection()
        }
    }

    async closeConnection() {
        if (this.dbcon) {
            this.dbcon.end()
        }
    }

    async loadUsers(username) {
        await this.createConnection()
        let users = await query(this.dbcon, `select * from user where username != '${username}'`)
        return users
    }

    async loadAllUsers() {
        await this.createConnection()
        let users = await query(this.dbcon, `select * from user`)
        return users
    }
}

module.exports = {
    User,
    UserManager
}
