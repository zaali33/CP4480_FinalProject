/**

* @jest-environment node

*/
const axios = require('axios')
const { test, expect } = require('@jest/globals')

test('Case 1: Login is successful', async () => {
    let res = await axios.post(
        'http://192.168.56.2:3006/api/login',
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
        'http://192.168.56.2:3006/api/login',
        {
            "username": 'admin333',
            "password": 'admin123'
        }
    ).catch(function(error) {
        expect(error.response.status).toBe(401)
    })
})

test("Case 1: Valid token to load users", async () => {
    //get the valid token
    let loginRes = await axios.post(
        'http://192.168.56.2:3006/api/login',
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginRes.data.token
    let loadUsersRes = await axios.get(
        'http://192.168.56.2:3006/api/loadUsers',
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    expect(loadUsersRes.status).toBe(200)
})

test("Case 2: Invalid token to load users", async () => {
    //get a valid token
    let loginRes = await axios.post(
        'http://192.168.56.2:3006/api/login',
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    //make the token invalid
    let token = loginRes.data.token + "1234"
     await axios.get(
        'http://192.168.56.2:3006/api/loadUsers',
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
        'http://192.168.56.2:3006/api/login',
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token + "1818"

    // check sending messages
    await axios.post(
        'http://192.168.56.2:3006/api/sendMessage',
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

test("Case 2: Valid token to send messages", async () => {
    //get the token
    let loginCheck = await axios.post(
        'http://192.168.56.2:3006/api/login',
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token

    // check sending messages
    let sendMessage = await axios.post(
        'http://192.168.56.2:3006/api/sendMessage',
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
    expect(sendMessage.status).toBe(201)
    expect(sendMessage.data).toBe("Message sent and created")
})


// m not sure if this is the right way but i checked 500 internal error by deleting a column from database lol
test("Case 3: Internal Server Error for send messages when token is valid", async () => {
      //get the token
      let loginCheck = await axios.post(
        'http://192.168.56.2:3006/api/login',
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token

    // send message
     await axios.post(
        'http://192.168.56.2:3006/api/sendMessage',
        {
            "receiver": 'aisha',
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
        'http://192.168.56.2:3006/api/login',
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token + "1234"

    // check viewing messages
    await axios.post(
        'http://192.168.56.2:3006/api/viewUserMessage',
        {
            "receiver": 'admin',
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


test("Case 2: Valid token for view messages", async () => {
    //get the token
    let loginCheck = await axios.post(
        'http://192.168.56.2:3006/api/login',
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token

    // check viewing messages
    let viewUserMessage = await axios.post(
        'http://192.168.56.2:3006/api/viewUserMessage',
        {
            "receiver": 'admin',
        },
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    expect(viewUserMessage.status).toBe(200)
})

test("Case 1: Admin view all messages", async () => {
    let loginCheck = await axios.post(
        'http://192.168.56.2:3006/api/login',
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token
    let viewAllMessages = await axios.post(
        'http://192.168.56.2:3006/api/adminViewAllMessages',
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
        'http://192.168.56.2:3006/api/login',
        {
            "username": 'zainab',
            "password": 'zainab123'
        }
    )
    let token = loginCheck.data.token
    let viewAllMessages = await axios.post(
        'http://192.168.56.2:3006/api/adminViewAllMessages',
        {
            "username": 'aisha'
        },
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    expect(viewAllMessages.status).toBe(401)
    
})

test("Case 1: Admin loading admin screen", async () => {
    let loginCheck = await axios.post(
        'http://192.168.56.2:3006/api/login',
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginCheck.data.token
    let adminUsers = await axios.get(
        'http://192.168.56.2:3006/api/loadAdminScreen',
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    expect(adminUsers.status).toBe(200)
    //load all 5 users except the admin himself
    expect(adminUsers.data.length).toBe(4)
})


test("Case 2: Normal user loading admin screen", async () => {
    let loginCheck = await axios.post(
        'http://192.168.56.2:3006/api/login',
        {
            "username": 'zainab',
            "password": 'zainab123'
        }
    )
    let token = loginCheck.data.token
    console.log(token)
    let viewAllMessages = await axios.get(
        'http://192.168.56.2:3006/api/loadAdminScreen',
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    expect(viewAllMessages.data).toBe('Only for admin')
    expect(viewAllMessages.status).toBe(401)
})