exports.Init = function (args, chan, basePath, cli) {
    cli.on("message", (message) => {
        if (message.content.startsWith("$edit")) {
            const fs = require('fs');
            const path = require('path');
            const ENV_VAR_DISABLED_FOLDERS = fs.readFileSync(basePath + path.sep + "VirtualDrive" + path.sep + "dir.cfg").toString().split("\n");
            if (!path.resolve(message.content.substring(message.content.indexOf(" ") + 1)).includes("VirtualDrive") || message.content.substring(message.content.indexOf(" ") + 1).includes("VirtualDrive") || ENV_VAR_DISABLED_FOLDERS.includes((path.basename(path.resolve(message.content.substring(message.content.indexOf(" ") + 1)))))) {
                message.channel.send("Error: cannot access this path.");
            }
            else {
                if (fs.existsSync(message.content.substring(message.content.indexOf(" ") + 1))) {
                    let filter = m => m.author.id === message.author.id;
                    message.channel.send(`Type anything or type \"\`cancel\`\" to cancel. Waiting for data...`).then(() => {
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        })
                            .then(message => {
                                message = message.first()
                                if (message.content.toUpperCase() == 'CANCEL' || message.content.toUpperCase() == 'C') {
                                    message.channel.send(`Terminated`)
                                } else {
                                    var data = message.content.toString()
                                    var dataClear = data;
                                    if (data.split("\n")[0].startsWith("```")) {
                                        console.log(data.replace(/(\r)+/gm, "\\r").replace(/(\n)+/gm, "\\n"))
                                        dataClear = null;
                                        for (let i = 0; i < data.split("\n"); i++) {
                                            if (i == 0) { continue; }
                                            if (i == (data.split("\n").length + 1)) { continue; }
                                            dataClear += data.split("\n")[i];
                                        }
                                    }
                                    console.log(dataClear);
                                }
                            })
                            .catch(collected => {
                                message.channel.send('Timeout');
                            });
                    })
                }
                else {
                    message.channel.send("Error: target file doesn't exist.");
                }
            }
        }
    });
};

exports.Version = 1.0;