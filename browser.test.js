/**

* @jest-environment node

*/

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
})