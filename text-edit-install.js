exports.Init = function (args, chan, basePath, cli) {
    cli.cmdList["edit"] = "edit a file";
    cli.on("message", (message) => {
        if (message.content.startsWith("$edit")) {
            const fs = require('fs');
            const path = require('path');

            let pathCorrected = message.content.substring(message.content.indexOf(" ") + 1);

            if (pathCorrected == "$edit") { return; }

            for (let i = 0; i < Object.keys(cli.listEnv).length; i++) {
                pathCorrected = cli.coolTools.replaceAll(pathCorrected, Object.keys(cli.listEnv)[i], cli.listEnv[Object.keys(cli.listEnv)[i]]);
            }

            if (pathCorrected.startsWith("/")) {
                pathCorrected = pathCorrected.replace("/", basePath + path.sep + "VirtualDrive" + path.sep);
            }

            // console.log(pathCorrected);

            const ENV_VAR_DISABLED_FOLDERS = fs.readFileSync(basePath + path.sep + "VirtualDrive" + path.sep + "dir.cfg").toString().split("\n");
            if (!path.resolve(pathCorrected).includes("VirtualDrive") || ENV_VAR_DISABLED_FOLDERS.includes((path.basename(path.resolve(pathCorrected))))) {
                // if (!path.resolve(pathCorrected).includes("VirtualDrive") || pathCorrected.includes("VirtualDrive") || ENV_VAR_DISABLED_FOLDERS.includes((path.basename(path.resolve(pathCorrected))))) {
                message.channel.send("Error: cannot access this path.");
            }
            else {
                if (fs.existsSync(pathCorrected)) {
                    editFile(message, pathCorrected, cli);
                }
                else {
                    message.channel.send("Target file doesn't exist. Creating one for you...");
                    cli.executeCommand(cli.fakeMessageCreator("$touch " + pathCorrected))
                    editFile(message, pathCorrected, cli);
                }
            }
        }
    });
};

function editFile(message, pathCorrected, cli) {
    const fs = require('fs');
    const path = require('path');
    let filter = m => m.author.id === message.author.id;
    let filename = pathCorrected;
    // prevent user from executing commands while in text edit mode
    cli.enableStdin = false;
    message.channel.send(`Type anything or type \"\`cancel\`\" to cancel. Waiting for data (1 minute)...`).then(() => {
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ['time']
        })
            .then(message => {
                message = message.first()
                if (message.content.toUpperCase() == 'CANCEL' || message.content.toUpperCase() == 'C') {
                    message.channel.send(`Terminated`)
                    cli.enableStdin = true;
                } else {
                    /**
                     * @type {string}
                     */
                    var data = message.content.toString();
                    var dataClear = data;
                    var dataLines = data.split("\n")
                    if (dataLines[0].startsWith("```") && dataLines[dataLines.length - 1].startsWith("```")) {
                        //console.log(data.replace(/(\r)+/gm, "\\r").replace(/(\n)+/gm, "\\n"))
                        //dataClear = "\0";
                        //console.log(data.split(/(\n)+/gm));
                        // for (let i = 0; i < data.split(/(\n)+/gm).length; i++) {
                        //     //console.log(i);
                        //     //console.log(data.split(/(\n)+/gm)[i]);
                        //     if (i == 0) { continue; }
                        //     if (i == (data.split(/(\n)+/gm).length-1)) { continue; }
                        //     dataClear += data.split(/(\n)+/gm)[i];
                        // }

                        var lines = data.split('\n');
                        lines.splice(0, 1);
                        lines.splice(lines.length - 1, 1);
                        dataClear = lines.join('\n');
                    }
                    console.log(dataClear);
                    fs.writeFileSync(filename, dataClear);
                    message.channel.send("Written " + (encodeURI(dataClear).split(/%..|./).length - 1) + " bytes");
                    cli.enableStdin = true;
                }
            })
            .catch(collected => {
                console.log(collected);
                message.channel.send('Timeout');
                cli.enableStdin = true;
            });
    })

    // setTimeout(() => {
    //     cli.enableStdin = true;
    // }, 2000)
    // cli.enableStdin = true;
}

// lol, i forgot to mention that version is float so this is wrong 
//                    \/
//exports.Version = 2.10;

exports.Version = 3.6;
