exports.Init = function (args, chan, cli) {
    let ls = null;
    ls = spawn("mpm", ["install", "puppeteer"]);

    ls.on("close", code => {
        cli.on("message", (message) => {
            if (message.content.startsWith("$wv")) {
                const puppeteer = require('puppeteer');

                (async () => {
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.goto('https://example.com');
                    await page.screenshot({ path: 'example.png' });

                    await browser.close();
                })();
            }
        });
    });
};