const puppeteer = require('puppeteer')
const fs = require('fs').promises

const economicalPartners = async () => {
    const browserPath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe'
    const browser = await puppeteer.launch({executablePath: browserPath, dumpio: true})
    const page = await browser.newPage()

    await page.goto('https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)', {waitUntil: 'load'})

    console.log('Getting all Wiki URLs for all the countries')
    // const requiredUrlObj = await page.evaluate(async () => {
    //     const requiredUrlObj = [];
    //     let countriesNode = document.querySelectorAll('table.wikitable td span.flagicon + a')
    //     countriesNode.forEach((el) => {
    //         requiredUrlObj.push({
    //             country: el.innerText,
    //             Url: el.href 
    //         })
    //     })
    //     return requiredUrlObj;
    // })

    console.log('Getting required Import/Export partner data')
    let finalData = [{'country': 'India', 'import_partners': 'Russia,France', 'export_partners': 'Nepal,Vietnam'}]
    // for (obj of requiredUrlObj) {
    //     // console.log(obj.country)
    //     await page.goto(obj.Url, { waitUntil: 'load' })
    //     let eachCountryData = await page.evaluate(async (obj) => {
    //         // country, export_partners, import_partners
    //         let requiredData = {};
    //         requiredData.country = obj.country;
    //         const isInfoTableAvailable = !!document.querySelector('table.infobox')
    //         // console.log('Info Available for:', obj.country, isInfoTableAvailable)
    //         if (isInfoTableAvailable) {
    //             let exportPartnersNode = getElementsByXPath(`//*[contains(text(),'Main export partner')]//parent::th//following-sibling::td//div//li//a[@title]`)
    //             let importPartnerNode = getElementsByXPath(`//*[contains(text(),'Main import partner')]//parent::th//following-sibling::td//div//li//a[@title]`)
    //             let exportPartner = "";
    //             let importPartner = "";
    //             for (partner of exportPartnersNode) {
    //                 exportPartner += exportPartner.innerText ? exportPartner.innerText : ''
    //             }
    //             for (partner of importPartnerNode) {
    //                 importPartner += importPartner.innerText ? importPartner.innerText : ''
    //             }
    //             requiredData.export_partners = exportPartner;
    //             requiredData.import_partners = importPartner;
    //         }
    //         return requiredData
    //         function getElementsByXPath(xpath, parent) {
    //             let results = [];
    //             let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); for (let i = 0, length = query.snapshotLength; i < length; ++i) {
    //                 results.push(query.snapshotItem(i));
    //             } return results;
    //         }
    //     }, obj)
    //     finalData.push(eachCountryData)
    // }

    const listOfKeys = async (data) => Object.keys(data);
    let keysList = await listOfKeys(finalData[0])
    let keys = (await listOfKeys(finalData[0])).join(',') + '\n'


    try { await fs.writeFile('./partnerData.csv', keys) } catch (err) { console.log(err.message) }

    for (data of finalData) {
        console.log("D",data)
        let dataToAppend = []
        for (key of keysList) {
            console.log("K",key)
            dataToAppend.push(`"${data[key]}"`)
        }
        try { await fs.appendFile('./partnerData.csv', dataToAppend.join(',') + '\n') } catch (err) { console.log(err.message) }
    }
    console.log(`Added ${finalData.length} rows successfully`)

    await page.close()
    await browser.close()
}

economicalPartners()