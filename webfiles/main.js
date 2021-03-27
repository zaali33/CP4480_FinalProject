let selectedUser = undefined
let selectedClassName = undefined

function viewUserMessages(className, username) {
    selectedClassName = className
    document.querySelectorAll('.single-user').forEach(e => e.classList.remove('selected'));
    className.classList.add('selected')
    selectedUser = username
    $.ajax({// eslint-disable-line no-undef
        url: "/api/viewUserMessage",
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify({ username: username }),
        success: function (result) {
            let msgContainer = document.getElementsByClassName('messages-container')[0]
            msgContainer.innerHTML = ""
            result.forEach(msg => {
                if (msg.receiverid === username) {
                    msgContainer.innerHTML += `
                        <div class="send-msg-container">
                            <div class="send-msg">
                                ${msg.message}
                            </div>
                        </div>
                    `
                }
                else {
                    msgContainer.innerHTML += `
                        <div class="receive-msg-container">
                            <div class="receive-msg">
                                ${msg.message}
                            </div>
                        </div>
                    `
                }

            })
        },

        error: function (j, t, e) {// eslint-disable-line  no-unused-vars
            window.location.href = "/messages.html"
        }
    })
}

function sendMessage() {// eslint-disable-line  no-unused-vars
    if (selectedUser) {
        let message = document.getElementById('message-content').value
        if(message !== "") {
            $.ajax({// eslint-disable-line  no-undef
                url: "/api/sendMessage",
                method: "POST",
                contentType: 'application/json',
                data: JSON.stringify({ receiver: selectedUser, message: message }),
                success: function () {
                    viewUserMessages(selectedClassName, selectedUser)
                    document.getElementById('message-content').value = ""
                },
                error: function (j, t, e) {// eslint-disable-line  no-unused-vars
                    alert("Internal error occured")
                    window.location.href = "/messages.html"
                }
            })
        }
    }
}

function doLogin() {// eslint-disable-line  no-unused-vars
    let us = $("#username").val()// eslint-disable-line  no-undef
    let pw = $("#password").val()// eslint-disable-line  no-undef

   let loginRequest = {
        username: us,
        password: pw,
    }

    $.ajax({// eslint-disable-line  no-undef
        url: "/api/login",
        method: "post",
        contentType: "application/json",
        data: JSON.stringify(loginRequest),
        success: function () {
            window.location.href = "/messages.html"
        },
        error: function (j, t, e) {// eslint-disable-line  no-unused-vars
            alert("Invalid credentials")
            window.location.href = "/"
        }
    })
}

function loadUsers() {// eslint-disable-line  no-unused-vars
    let userContainer = document.getElementsByClassName('user-container')[0]
    userContainer.innerHTML = ""
    $.ajax({// eslint-disable-line  no-undef
        url: "/api/loadUsers",
        method: "get",
        contentType: "application/json",
        success: function (result) {
            result.forEach(user => {
                userContainer.innerHTML += `
                    <div class="single-user" onclick="viewUserMessages(this, '${user.username}')">
                        <div class="user-details">
                            ${user.username}
                        </div>
                    </div>
                `
            })
        },
        error: function (j, t, e) {// eslint-disable-line  no-unused-vars
            alert("Invalid credentials")
            window.location.href = "/"
        }
    })
}

// function to loadAdminScreen - if admin then show admin container
function loadAdminScreen() {
    let adminContainer = document.getElementsByClassName('admin-user-container')[0]
    adminContainer.innerHTML = ""
    $.ajax({
        url: "/api/loadAdminScreen",
        method: "get",
        contentType: "application/json",
        success: function (result) {
            console.log(result)
            if(result.length > 0) {
                console.log(result)
                result.forEach(user => {
                    adminContainer.innerHTML += `
                        <div class="single-user" onclick="adminViewAllMessages(this, '${user.username}')">
                            <div class="user-details">
                                ${user.username}
                            </div>
                        </div>
                    `
            })
        }
            
        },
        error: function (j, t, e) {
            console.log(j, t, e)
        }
    })
}

// to view selected user messages
function adminViewAllMessages(className, username) {
    selectedClassName = className
    document.querySelectorAll('.single-user').forEach(e => e.classList.remove('selected'));
    className.classList.add('selected')
    selectedUser = username
    $.ajax({
        url: "/api/adminViewAllMessages",
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify({ username: username }),
        success: function (result) {
            let msgContainer = document.getElementsByClassName('admin-messages-container')[0]
            msgContainer.innerHTML = ""
            result.forEach(msg => {
                if (msg.senderid === username) {
                    msgContainer.innerHTML += `
                        <div class="send-msg-container">
                            <div class="sent-to">
                                to ${msg.receiverid}
                            </div>
                            <div class="send-msg">
                                ${msg.message}
                            </div>
                        </div>
                    `
                }
            })
        },
        error: function (j, t, e) {
            window.location.href = "/messages.html"
        }
    })
}

function start() {// eslint-disable-line  no-unused-vars
    $.ajax({// eslint-disable-line  no-undef
        url: "/api/start",
        method: "get",
        success: function (result) {
            console.log(result)
        },
        error: function (x, t, s) {// eslint-disable-line  no-unused-vars
            console.log("error")
        }
    })
}