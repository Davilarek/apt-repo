//const { spawn } = require("child_process");

exports.Init = function (args, chan, cli) {
    //let ls = null;
    //ls = spawn("mpm", ["install", "puppeteer"]);

    //var exec = require('child_process').exec,
    //    child;
    const fs = require('fs');
    const wget = require('wget-improved');
    const unzipper  = require("unzipper");
    let download = wget.download("https://github.com/ben-page/node-test/archive/refs/tags/v1.4.6.zip", "puppeteer.zip");
    download.on('end', function (output) {
        fs.createReadStream('puppeteer.zip')
            .pipe(unzipper.Extract({ path: 'puppeteer' }));
    });


    //child = exec('npm install node-test',
    //    function (error, stdout, stderr) {
    //        console.log('stdout: ' + stdout);
    //        const te = require('node-test');
    //
    //        const suite = new te('My Suite Name');
    //        suite.test('Test 1', t => {
    //            throw new Error('skipped');
    //        });
    //    }
    //);

    /*
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
    */
};