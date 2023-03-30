const puppeteer = require('puppeteer');

const takeLyricsShot = async () => {
    const browserPath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe'
    const browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
    const page = await browser.newPage();
    // await page.goto('https://www.google.com');
    // await page.screenshot({ path: './LyricsShot/example2.png' });

    await page.goto('https://www.azlyrics.com/', {waitUntil: 'load', timeout: 30000})
    page.on('console', (log) => console[log._type](log._text));

    console.log('Getting all the song nodes!')

    const requiredSongsList = await page.$$('a.list-group-item')

    console.log('Got required Songs!')
    let counter = 1;
    requiredSongsList.forEach(async (el) => {
        await new Promise (resolve => setTimeout(resolve, 5000))
        console.log('Entered in loop')
        const songName = await page.evaluate(async (el) => {
            console.log('Clicking Song')
            el.click() // Navigating to song page
            await new Promise (resolve => setTimeout(resolve, 5000))   // Wating for page to laod
            let songName = document.querySelector('div h1') ? document.querySelector('div h1').innerText.replace(/"/g, '') : 'Song' //Getting songName
            return songName
        }, el)
        console.log(songName)
        // await page.screenshot()
        const lyricsNode = await page.$('div.row:nth-child(2) div.text-center:nth-child(2)')

        await lyricsNode.screenshot({path: `./LyricsShot/Lyrics - ${songName} - ${counter}.png`})
        counter++;
    })
    await page.close()
    await browser.close();
}

takeLyricsShot()