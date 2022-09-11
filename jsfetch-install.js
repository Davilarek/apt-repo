const path = require("path");

exports.Version = "0.2.1";

exports.Options = {
    upgradeFromGithubRequired: true,
};

exports.Init = function (args, chan, basePath, cli) {
    // cli.cmdList["git"] = "run bot-side git commands";
    // cli.on("message", (message) => {
    // 	if (message.content.startsWith("$git")) {
    // const wget = require(basePath + "/wget-fromscratch.js");
    // const path = require("path");

    const fs = require("fs");
    cli.registerExternalCommand("linuxjsfetch", (message) => {
        // if (message.split(" ")[1]) {
        //     message = message.split(" ")[1];
        // }
        // else {
        //     message.channel.send('');
        // }
        // /\ good template for command that need arguments

        const ans = fs.readFileSync(basePath + path.sep + "linuxjs.txt", "utf-8");

        const fullString = ans.split("\n");
        for (let i = 0; i < fullString.length; i++) {
            fullString[i] += "   ";
        }
        fullString[0] += cli.listEnv["$USER"] + "@" + cli.machineInfo.NODENAME;
        // fullString[1] += "   ";
        for (let i = 0; i < (cli.listEnv["$USER"] + "@" + cli.machineInfo.NODENAME).length; i++) {
            fullString[1] += "-";
        }
        fullString[2] += "OS: " + "LinuxJS " + cli.machineInfo.PLATFORM + " " + cli.machineInfo.MACHINE;
        fullString[3] += "Host: " + "Unknown";
        fullString[4] += "Kernel: " + cli.machineInfo.KERNEL_RELEASE;
        const packages = [];
        fs.readdirSync(cli.aptProtectedDir + path.sep + "autorun").forEach(file => {
            // console.log(file);
            if (file == "empty.txt") { return; }
            if (path.extname(file) == ".js" && typeof require(cli.aptProtectedDir + path.sep + "autorun" + path.sep + file).Init === 'function') {
                packages.push(file);
            }
        });
        fullString[5] += "Packages: " + packages.length;
        fullString[6] += "Shell: discordshell";
        fullString[7] += "CPU: " + "Unknown";
        fullString[8] += "GPU: " + "Unknown";
        fullString[9] += "Memory: " + "Unknown";
        fullString[10] += "Disk (/): " + "Unknown";


        // message.channel.send(cli.machineInfo.NODENAME);
        message.channel.send("```\n" + fullString.join("\n") + "\n```");
    }, "fast system info display");
};
