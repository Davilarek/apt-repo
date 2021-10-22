//const { spawn } = require("child_process");

exports.Init = function (args, chan, cli) {
    //let ls = null;
    //ls = spawn("mpm", ["install", "puppeteer"]);

    var exec = require('child_process').exec,
    child;
    
    child = exec('echo lol',
      function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
      }
    );

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