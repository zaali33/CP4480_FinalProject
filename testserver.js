let mysql = require('mysql')

<<<<<<< HEAD
const { MessageManager } = require("/var/www/msgapptest/message")
const { UserManager } = require("/var/www/msgapptest/user")

const bcrypt = require('bcrypt');
=======
const bcrypt = require('bcrypt')
const { MessageManager } = require("./webfiles/message.js")
const { UserManager } = require("./webfiles/user.js")
>>>>>>> c4ebb5594dd840fee563394891aeeedc0986d502

let messageManager = new MessageManager()
let userManager = new UserManager()

messageManager.setDbName('testmessage')
userManager.setDbName('testmessage')

connection = async () => new Promise(// eslint-disable-line no-undef
    (resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'testmessage'
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

const logMessage = (m) =>
    console.log(`${m} ${new Date()}`)

let allUsers = []
const loadAllUsers = async () => {
    allUsers = await userManager.loadAllUsers()
}

const authenticateUser = async (username, password) => {
    let c = false
    await loadAllUsers()
    let searchedUser = allUsers.find(u => u.username === username)
    if (searchedUser) {
        c = await bcrypt.compare(password, searchedUser.password)
        return c 
    } else {
        return c
    }
}

let express = require('express')
let app = express()
app.use(express.json())
//app.use(express.static('webfiles'))

let jwt = require('jsonwebtoken')
let cookieParser = require('cookie-parser')
app.use(cookieParser())

let appSecret = 'plmcbdgosihesirbadnapdojauryrgsbjaknpas852972164lokodnshgkhonfshdbks'

app.get('/api/start', (req, res) => {
    res.send('Messages Application started at ' + new Date())
    logMessage('Messages Application started at')
})

app.post('/api/login', async (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let authenticated = await authenticateUser(username, password)
    if (authenticated) {
        let user = {
            username: username,
        }
        let token = jwt.sign(user, appSecret, { expiresIn: 20000 })
        res.cookie('user-token', token, { httpOnly: true })
        res.send({token, msg: "ok"})
        res.status(200)
        return
    }
    res.status(401)
    res.send("not authorized")
})

app.get('/api/messages/:id', async (req, res) => {
    let receiverid = req.params.id
    try {
        let token = req.cookies['user-token']
        let user = jwt.verify(token, appSecret)
        try {
            let messages = await messageManager.getSenderReceiverMessages(user.username, receiverid)
            res.send(messages)
        }
        catch (e) {
            res.status(500)
            res.send("Internal Database Server Error")
        }
    }
    catch (e) {
        res.status(401)
        res.send("Unauthorized")
    }
})

app.post('/api/message', async (req, res) => {
    let receiverid = req.body.receiver
    let message = req.body.message
    try {
        let token = req.cookies['user-token']
        let senderid = jwt.verify(token, appSecret)
        try {
            await messageManager.sendMessage({ message, receiverid, senderid: senderid.username })
            res.status(201)
            res.send("Message sent and created")
        }
        catch (e) {
            res.status(500)
            res.send(e)
        }
    }
    catch (e) {
        res.status(401)
        res.send("Unauthorized")
    }
})

app.get('/api/users', async (req, res) => {
    try {
        let token = req.cookies['user-token']
        let senderid = jwt.verify(token, appSecret)
        try {
            let users = await userManager.loadUsers(senderid.username)
            res.status(200)
            res.send({users: users})
        }
        catch (e) {
            res.status(500)
            res.send("Internal Database Server Error") //when the connection is failing or the sql query is incorrect
        }
    }
    catch (e) {
        res.status(401)
        res.send("Unauthorized")
    }
})

// rest api for loadAdminScreen
app.get('/api/adminusers', async (req, res) => {
    try {
        let token = req.cookies['user-token']
        let user = jwt.verify(token, appSecret)
        try {
            if(user.username === "admin")
            {
                let users = await userManager.loadUsers(user.username)
                res.status(200)
                res.send(users)
            }
            else {
                res.status(401)
                res.send('Only for admin')
            }
        }
        catch (e) {
            res.status(500)
            res.send("Internal Database Error")
        }
    }
    catch (e) {
        res.status(401)
        res.send("Unauthorized")
    }
})

// rest api for admin seeing all messages
app.post('/api/adminmessages', async (req, res) => {
    let senderid = req.body.username
    try {
        let token = req.cookies['user-token']
        let user = jwt.verify(token, appSecret)
        try {
            if(user.username === "admin") {
                let messages = await messageManager.getAllSenderMessages(senderid)
                console.log("admin able to see")
                res.status(200)
                res.send(messages)
            }
            else {
                res.status(401).send('Only for admin')
            }
        }
        catch (e) {
            res.status(500)
            res.send(e)
        }
    }
    catch (e) {
        res.status(401)
        res.send("Unauthorized")
    }
})


app.listen(3006, () => {
    logMessage("The messages application is running on testing port")
})
