const puppeteer = require('puppeteer')
const fs = require('fs')

const economicalPartners = async () => {
    const browserPath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe'
    const browser = await puppeteer.launch({executablePath: browserPath, dumpio: true})
    const page = await browser.newPage()

    await page.goto('https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)', {waitUntil: 'load'})

    console.log('Getting all Wiki URLs for all the countries')
    const requiredUrlObj = await page.evaluate(async () => {
        const requiredUrlObj = [];
        let countriesNode = document.querySelectorAll('table.wikitable td span.flagicon + a')
        countriesNode.forEach((el) => {
            requiredUrlObj.push({
                country: el.innerText,
                Url: el.href 
            })
        })
        return requiredUrlObj;
    })

    console.log('Getting required Import/Export partner data')
    for (obj of requiredUrlObj) {
        console.log(obj.country)
        await page.goto(obj.Url, { waitUntil: 'load' })
        await page.evaluate(async (obj) => {
            const isInfoTableAvailable = !!document.querySelector('table.infobox')
            console.log('Info Available for:', obj.country, isInfoTableAvailable)
        }, obj)
    }

    await page.close()
    await browser.close()
}

economicalPartners()