/**

* @jest-environment node

*/
const puppeteer = require('puppeteer')

const { test, expect } = require("@jest/globals");

const { MessageManager } = require("/var/www/msgapptest/message")
const { UserManager } = require("/var/www/msgapptest/user")

const bcrypt = require('bcrypt');

let messageManager = new MessageManager()
let userManager = new UserManager()

messageManager.setDbName('testmessage')
userManager.setDbName('testmessage')
messageManager.delete()

let basePath = "http://192.168.56.2:81/"

test("Login success takes to messages.html page", async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(basePath)
    await page.focus('input[name="username"]')
    await page.keyboard.type('admin')
    await page.focus('input[name="password"]')
    await page.keyboard.type("admin123")
    let loginButton = await page.$('input[name="login-btn"]')
    await loginButton.click()
    await page.waitForNavigation()
    let result = await page.url()
    expect(result).toBe(`${basePath}messages.html`)
}, 30000)

test("Login unsuccessful takes to the login page", async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(basePath)
    await page.focus('input[name="username"]')
    await page.keyboard.type('aisha')
    await page.focus('input[name="password"]')
    await page.keyboard.type("admin1443")
    let loginButton = await page.$('input[name="login-btn"]')
    await loginButton.click()
    await page.waitForNavigation()
    let result = await page.url()
    expect(result).toBe(basePath)
}, 30000)

test("Normal user loading other users see all users except him/herself", async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(basePath)
    await page.focus('input[name="username"]')
    await page.keyboard.type('aisha')
    await page.focus('input[name="password"]')
    await page.keyboard.type("aisha123")
    let loginButton = await page.$('input[name="login-btn"]')
    await loginButton.click()
    await page.waitForNavigation()
    let result = await page.url()
    await page.goto(result)
   // const userContainer = await page.$$('.single-user'); 

    const userContainer = await page.$$('.single-user'); 

    let users = [];
    for(let i = 0; i < userContainer.length; i++){
        let user = await (await userContainer[i].getProperty('innerText')).jsonValue();
        users.push(user); 
    }
    console.log(users)
     await browser.close()
     expect(users).toStrictEqual(['admin', 'hanan', 'sarah','zainab']) 

}, 30000)


test("Browser testing for sending messages shows the message in the messages container", async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(basePath)
    await page.focus('input[name="username"]')
    await page.keyboard.type('aisha')
    await page.focus('input[name="password"]')
    await page.keyboard.type("aisha123")
    let loginButton = await page.$('input[name="login-btn"]')
    await loginButton.click()
    await page.waitForNavigation()
    let result = await page.url()
    await page.goto(result)
    await page.waitForSelector('.single-user')
    await page.evaluate(async () => {
        let elements = await document.getElementsByClassName('single-user');
        await elements[1].click();
    })
    await page.evaluate(() => {
        document.querySelector('textarea#message-content').value = 'hello hanan!!!!'
    })
    await page.evaluate( async() => {
        let sendbtn = await document.getElementById('send-btn');
        await sendbtn.click();
    });
    await page.waitForSelector('.send-msg')
    const sendmsg = await page.$$('.send-msg'); 
    const sentmsg = await (await sendmsg[0].getProperty('innerText')).jsonValue()
    await browser.close()
    expect(sentmsg).toEqual('hello hanan!!!!')
}, 30000)

test("Browser test for admin messages, admin can see all the messages including the one that was just sent", async() => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(basePath)
    await page.focus('input[name="username"]')
    await page.keyboard.type('admin')
    await page.focus('input[name="password"]')
    await page.keyboard.type("admin123")
    let loginButton = await page.$('input[name="login-btn"]')
    await loginButton.click()
    await page.waitForNavigation()
    let result = await page.url()
    await page.goto(result)
    await page.waitForSelector('.single-user')
    await page.evaluate( async() => {
        let elements = document.getElementsByClassName('single-user');
        await elements[4].click();
    });
    await page.waitForSelector('.sent-to')
    const sentTo = await page.$$('.sent-to'); 
    const receiver = await (await sentTo[0].getProperty('innerText')).jsonValue()
    await browser.close()
    expect(receiver).toEqual('to hanan')
}, 30000)

test("Browser test for normal user loading admin screen", async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(basePath)
    await page.focus('input[name="username"]')
    await page.keyboard.type('hanan')
    await page.focus('input[name="password"]')
    await page.keyboard.type("hanan123")
    let loginButton = await page.$('input[name="login-btn"]')
    await loginButton.click()
    await page.waitForNavigation()
    let result = await page.url()
    await page.goto(result)
    let adminContent = "testing"
    adminContent = await page.evaluate(() => document.getElementsByClassName('admin-messages-container')[0].innerText)
    await browser.close()
    expect(adminContent).toBe("")
}, 30000)

test("Browser test checking logout", async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(basePath)
    await page.focus('input[name="username"]')
    await page.keyboard.type('hanan')
    await page.focus('input[name="password"]')
    await page.keyboard.type("hanan123")
    let loginButton = await page.$('input[name="login-btn"]')
    await loginButton.click()
    await page.waitForNavigation()
    let result = await page.url()
    await page.goto(result)
    let logoutButton = await page.$('input[name="logout-btn"]')
    await logoutButton.click()
    await page.waitForNavigation()
    let result2 = await page.url()
    await browser.close()
    expect(result2).toBe(basePath)
}, 30000)