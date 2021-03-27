class Message {
    constructor(message, senderid, receiverid) {
        this.message = message
        this.senderid = senderid
        this.receiverid = receiverid
    }
}

class MessageManager {
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

    async sendMessage(message) {
        await this.createConnection()
        await query(this.dbcon, `insert into message (message, receiverid, senderid, date) values('${message.message}', '${message.receiverid}', '${message.senderid}', now());`)
    }

    async getSenderReceiverMessages(senderid, receiverid) {
        await this.createConnection()
        let messages = await query(this.dbcon, `select * from message where (senderid = '${senderid}' and receiverid = '${receiverid}') or (senderid = '${receiverid}' and receiverid = '${senderid}') order by date;`)
        return messages
    }

    async getAllSenderMessages(senderid) {
        await this.createConnection()
        let messages = await query(this.dbcon, `select * from message where (senderid = '${senderid}') order by date;`)
        return messages
    }
}

module.exports = {
    Message,
    MessageManager
}
