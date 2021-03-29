/**

* @jest-environment node

*/
const axios = require('axios')
const { test, expect } = require('@jest/globals')

const { MessageManager } = require("/var/www/msgapptest/message")
const { UserManager } = require("/var/www/msgapptest/user")

let messageManager = new MessageManager()
let userManager = new UserManager()

messageManager.setDbName('testmessage')
userManager.setDbName('testmessage')

//get rid of everything in the messages tables
messageManager.delete()

let basePath = "http://192.168.56.2:3006/api"

test('Case 1: Login is successful', async () => {
    let res = await axios.post(
        `${basePath}/login`,
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    expect(res.status).toBe(200)
    expect(res.data.msg).toBe("ok")
})

test('Case 2: Login is unsuccessful', async () => {
    await axios.post(
        `${basePath}/login`,
        {
            "username": 'admin333',
            "password": 'admin123'
        }
    ).catch(function(error) {
        expect(error.response.status).toBe(401)
    })
})

test("Case 1: Valid token to load users (should be 4 from database excluding the one loading)", async () => {
    //get the valid token
    let loginRes = await axios.post(
        `${basePath}/login`,
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginRes.data.token
    let loadUsersRes = await axios.get(
        `${basePath}/users`,
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    let userDb = await userManager.loadUsers('admin')
    expect(loadUsersRes.data.users.length).toBe(userDb.length)
    expect(loadUsersRes.status).toBe(200)
})

test("Case 2: Invalid token to load users", async () => {
    //get a valid token
    let loginRes = await axios.post(
        `${basePath}/login`,
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    //make the token invalid
    let token = loginRes.data.token + "1234"
    await axios.get(
        `${basePath}/users`,
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    ).catch(function(error) {
        expect(error.response.status).toBe(401)
    })
})

//Case 3: Internal Database Erorr (500) not sure about it yet...
//will ask from Sir Robert tomorrow so leave for now...where ever you see internall 500 error, leave it

// Aisha Unit Cases for Send Messages

test("Case 1: Invalid token to send messages", async () => {
    //get the token
    let loginCheck = await axios.post(
        `${basePath}/login`,
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token + "1818"

    // check sending messages
    await axios.post(
        `${basePath}/message`,
        {
            "receiver": 'aisha123',
            "message": 'Hello! This is wrong Case'
        },
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    ).catch(function(error) {
        expect(error.response.status).toBe(401)
    })
})

test("Case 2: Valid token to send messages increases the count", async () => {
    //get the token
    let loginCheck = await axios.post(
        `${basePath}/login`,
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token

    let initialMessage = await messageManager.countMessage()
    // check sending messages
    let sendMessage = await axios.post(
        `${basePath}/message`,
        {
            "receiver": 'aisha',
            "message": 'Valid Case'
        },
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    let afterMessage = await messageManager.countMessage()
    expect(afterMessage).toBe(initialMessage + 1)
    expect(sendMessage.status).toBe(201)
    expect(sendMessage.data).toBe("Message sent and created")
})


// raise 500 error with the valid token and user trying to send message to non existent user
test("Case 3: Internal Database Error for sending message to a non existent user (foriegn key failed) when token is valid", async () => {
      //get the token
      let loginCheck = await axios.post(
        `${basePath}/login`,
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token

    // send message
     await axios.post(
        `${basePath}/message`,
        {
            "receiver": 'aisha44', //aisha44 doesnt exist
            "message": 'Internal Error'
        },
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    .catch(function(error) {
        expect(error.response.status).toBe(500)
    })
})


//Hanan unit testing

test("Case 1: Invalid token to view messages", async () => {
    //get the token
    let loginCheck = await axios.post(
        `${basePath}/login`,
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token + "1234"

    // check viewing messages
    await axios.get(
        `${basePath}/messages/admin`,
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    ).catch(function(error) {
        expect(error.response.status).toBe(401)
    })
})


test("Case 2: Valid token for viewing messages between two users", async () => {
    //get the token
    //first user is the login user and the second user is the one passed in the body
    let loginCheck = await axios.post(
        `${basePath}/login`,
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token
    
    let usermessages = await messageManager.getAllSenderMessages('hanan')

    let sendMessage = await axios.post(
        `${basePath}/message`,
        {
            "message": "testing message from admin to hanan",
            "receiver": "hanan"
        },
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    // check viewing messages
    let viewUserMessage = await axios.get(
        `${basePath}/messages/hanan`,
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    await messageManager.closeConnection()
    expect(viewUserMessage.data.length).toBe(usermessages.length + 1)
    expect(viewUserMessage.status).toBe(200)
})

test("Case 1: Admin view all messages", async () => {
    let loginCheck = await axios.post(
        `${basePath}/login`,
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token
    let viewAllMessages = await axios.post(
        `${basePath}/adminmessages`,
        {
            "senderid": 'admin'
        },
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    expect(viewAllMessages.status).toBe(200)
})


test("Case 2: Normal user view all messages", async () => {
    let loginCheck = await axios.post(
        `${basePath}/login`,
        {
            "username": 'zainab',
            "password": 'zainab123'
        }
    )
    let token = loginCheck.data.token
    let viewAllMessages = await axios.post(
        `${basePath}/adminmessages`,
        {
            "username": 'aisha'
        },
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    ).catch(function(e) {
        expect(e.response.status).toBe(401)
    })

})

test("Case 1: Admin loading admin screen", async () => {
    let loginCheck = await axios.post(
        `${basePath}/login`,
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token

    let usermessages = await userManager.loadUsers('admin')

    let adminUsers = await axios.get(
        `${basePath}/adminusers`,
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    userManager.closeConnection()
    expect(adminUsers.status).toBe(200)
    //load all 5 users except the admin himself
    expect(adminUsers.data.length).toBe(usermessages.length)
})


test("Case 2: Normal user loading admin screen", async () => {
    let loginCheck = await axios.post(
        `${basePath}/login`,
        {
            "username": 'zainab',
            "password": 'zainab123'
        }
    )
    let token = loginCheck.data.token
    console.log(token)
    let viewAllMessages = await axios.get(
        `${basePath}/adminusers`,
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    ).catch(function(e) {
        expect(e.response.data).toBe('Only for admin')
        expect(e.response.status).toBe(401)
    })  
})
