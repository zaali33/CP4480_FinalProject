let mysql = require('mysql')// eslint-disable-line  no-undef
class Message {
    constructor(message, senderid, receiverid) {
        this.message = message
        this.senderid = senderid
        this.receiverid = receiverid
    }
}

class MessageManager {
    dbcon
    dbname
    constructor() {
        this.dbcon = undefined
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

    async sendMessage(message) {
        await this.createConnection()
        await this.query(this.dbcon, `insert into message (message, receiverid, senderid, date) values('${message.message}', '${message.receiverid}', '${message.senderid}', now()); insert into messages (message, receiverid, senderid, date) values('${message.message}', '${message.receiverid}', '${message.senderid}', now());`)
    }

    async checkMessage(message) {
        await this.createConnection()
        await this.query(this.dbcon, `select * from message where message = ${message.message}, receiverid = ${message.receiverid}, senderid = ${message.senderid}, date = ${message.date}`)
    }

    async countMessage() {
        await this.createConnection()
        let result = await this.query(this.dbcon, `select count(*) as count from message;`)
        return result[0].count
    }

    async getSenderReceiverMessages(senderid, receiverid) {
        await this.createConnection()
        let messages = await this.query(this.dbcon, `select * from message where (senderid = '${senderid}' and receiverid = '${receiverid}') or (senderid = '${receiverid}' and receiverid = '${senderid}') order by date;`)
        return messages
    }

    async getAllSenderMessages(senderid) {
        await this.createConnection()
        let messages = await this.query(this.dbcon, `select * from message where (senderid = '${senderid}') order by date;`)
        return messages
    }

    async delete() {
        await this.createConnection()
        await this.query(this.dbcon, `delete from message;`)
    }
}

module.exports = {// eslint-disable-line  no-undef
    Message,
    MessageManager
}
