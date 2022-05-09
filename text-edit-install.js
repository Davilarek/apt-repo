exports.Init = function (args, chan, basePath, cli) {
    cli.cmdList["edit"] = "edit a file";
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
                    let filename = message.content.substring(message.content.indexOf(" ") + 1);
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
                                }
                            })
                            .catch(collected => {
                                console.log(collected);
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

exports.Version = 2.1;
