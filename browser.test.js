/**

* @jest-environment node

*/
const ppConsole =  require ('puppeteer-console')

const puppeteer = require('puppeteer')

const { test, expect, describe } = require("@jest/globals");

test("Test Case 1 Valid token", async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto("http://192.168.56.2:3006/")
    await page.focus('input[name="username"]')
    await page.keyboard.type('admin')
    await page.focus('input[name="password"]')
    await page.keyboard.type("admin123")
    let loginButton = await page.$('input[name="login-btn"]')
    await loginButton.click()
    await page.waitForNavigation()
    let result = await page.url()
    expect(result).toBe("http://192.168.56.2:3006/messages.html")
    browser.close();
})


test("Test Case 2 InValid Token", async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto("http://192.168.56.2:3006/")
    await page.focus('input[name="username"]')
    await page.keyboard.type('aisha')
    await page.focus('input[name="password"]')
    await page.keyboard.type("admin1443")
    let loginButton = await page.$('input[name="login-btn"]')
    await loginButton.click()
    await page.waitForNavigation()
    let result = await page.url()
    expect(result).toBe("http://192.168.56.2:3006/")
    browser.close();
})


// test("Test Case 3 send messages", async () => {
//     const browser = await puppeteer.launch({ headless: false })
//     const page = await browser.newPage()
//     await page.goto("http://localhost:3006/")
//     await page.focus('input[name="username"]')
//     await page.keyboard.type('aisha')
//     await page.focus('input[name="password"]')
//     await page.keyboard.type("aisha123")
//     let loginButton = await page.$('input[name="login-btn"]')
//     await loginButton.click()
//     await page.waitForNavigation()
//     let result = await page.url()
//     await page.goto(result)
//     await page.evaluate(() => {
//         let elements = document.getElementsByClassName('single-user');
//         elements[0].click();
//     });
//     await page.evaluate(function() {           
//         document.querySelector('textarea#message-content').value = 'hello hanan!!!!'
//       })
//     let sendButton = await page.$('input[name="send-btn"]')
//     sendButton.click()

//     // await Promise.race([
//     //     page.waitForNavigation({waitUntil: "networkidle0"}),
//     //     page.waitForSelector('.send-msg')

//     // ])

//     let expectedResult = ''
//     await page.evaluate((expectedResult) => {
//         expectedResult = document.getElementsByClassName('send-msg')[0].innerHTML
//     }, expectedResult)
//     expect(expectedResult).toBe('hello hanan!!!!')

// })
