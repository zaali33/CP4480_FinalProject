let mysql = require('mysql')
class User {
    constructor(username, password, type) {
        this.username = username
        this.password = password
        this.type = type
    }
}

class UserManager {
    dbcon
    dbname
    constructor() {
        this.dbcon = undefined
        this.dbname = undefined
    }

    setDbName(dbname) {
        this.dbname = dbname
    }
    
    connection = async () => new Promise(// eslint-disable-line no-undef
        (resolve, reject) => {
            const connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'password',
                database: `${this.dbname}`
            });
            connection.connect(error => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(connection);
            })
        }
    );
    
    query = async (conn, q, params) => new Promise(// eslint-disable-line no-undef
        (resolve, reject) => {
            const handler = (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            }
            conn.query(q, params, handler);
        }
    );

    async createConnection() {
        if (!this.dbcon) {
            this.dbcon = await this.connection()
        }
    }

    async closeConnection() {
        if (this.dbcon) {
            this.dbcon.end()
        }
    }

    async loadUsers(username, ) {
        await this.createConnection()
        let users = await this.query(this.dbcon, `select * from user where username != '${username}'`)
        return users
    }

    async loadAllUsers() {
        await this.createConnection()
        let users = await this.query(this.dbcon, `select * from user`)
        return users
    }

    async delete() {
        await this.createConnection()
        await this.query(this.dbcon, `delete from user;`)
    }
}

module.exports = {
    User,
    UserManager
}
