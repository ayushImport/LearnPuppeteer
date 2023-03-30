const puppeteer = require('puppeteer');

const takeLyricsShot = async () => {
    const browserPath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe'
    const browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
    const page = await browser.newPage();
    // await page.goto('https://www.google.com');
    // await page.screenshot({ path: './LyricsShot/example2.png' });

    await page.goto('https://www.azlyrics.com/', {waitUntil: 'load'})
    // page.on('console', (log) => console[log._type](log._text));

    console.log('Getting all the song nodes!')

    const requiredSongsList = await page.$$eval('a.list-group-item', el => {
        return el.map(r => r.href)
    })

    let counter = 1;
    for (url of requiredSongsList) {
        console.log(url)
        console.log('Going to the Song Page!')

        await page.goto(url)

        const songName = await page.evaluate(async () => {
            let songName = document.querySelector('div h1') ? document.querySelector('div h1').innerText.replace(/"/g, '') : 'Song' //Getting songName
            return songName
        })
        console.log(songName)
        // await page.screenshot()
        const lyricsNode = await page.$('div.row:nth-child(2) div.text-center:nth-child(2)')

        await lyricsNode.screenshot({path: `./LyricsShot/Lyrics - ${songName} - ${counter}.png`})
        counter++;
    }

    await page.close()
    await browser.close();
}

takeLyricsShot()