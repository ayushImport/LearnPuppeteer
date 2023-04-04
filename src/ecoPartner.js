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
    let finalData = [];
    for (obj of requiredUrlObj) {
        console.log(obj.country)
        await page.goto(obj.Url, { waitUntil: 'load' })
        let eachCountryData = await page.evaluate(async (obj, getElementsByXPath) => {
            // country, export_partners, import_partners
            let requiredData = {};
            requiredData.country = obj.country;
            const isInfoTableAvailable = !!document.querySelector('table.infobox')
            console.log('Info Available for:', obj.country, isInfoTableAvailable)
            if (isInfoTableAvailable) { 
                let exportPartnersNode = getElementsByXPath(`//*[contains(text(),'Main export partner')]//parent::th//following-sibling::td//div//li//a[@title]`)
                let importPartnerNode = getElementsByXPath(`//*[contains(text(),'Main import partner')]//parent::th//following-sibling::td//div//li//a[@title]`)
                let exportPartner = "";
                let importPartner = "";
                for (partner of exportPartnersNode) {
                    exportPartner += exportPartner.innerText ? exportPartner.innerText : ''
                }
                for (partner of importPartnerNode) {
                    importPartner += importPartner.innerText ? importPartner.innerText : ''
                }
                requiredData.export_partners = exportPartner;
                requiredData.import_partners = importPartner;
            }
            return requiredData
        }, obj, getElementsByXPath)
        finalData.push(eachCountryData)
    }

    let listOfKeys = async (data) => listOfKeys = Object.keys(data);
    let keys = (await listOfKeys(finalData[0])).join(',')


    fs.writeFile('./../partnerData.csv', keys, (err) => {
        if (err) console.log(err)
        else console.log('Creating CSV file\nWritten Keys successfully from first data Obj!!\n')
    })

    for (data of finalData) {
        let dataToAppend = ''
        for (key of keys) {
            dataToAppend += `"${data[key]}"`
        }
        fs.appendFile('./../partnerData.csv', dataToAppend, (err) => {
            if (err) console.log(err)
        })
    }
    console.log(`Added ${finalData.length} rows successfully`)

    function getElementsByXPath(xpath, parent) {
        let results = [];
        let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); for (let i = 0, length = query.snapshotLength; i < length; ++i) {
            results.push(query.snapshotItem(i));
        } return results;
    }

    await page.close()
    await browser.close()
}

economicalPartners()