// Every package needs to contain four arguments, otherwise it will be rejected.
// `args` are arguments passed while installing/initializing package.
// `chan` is a channel object collected when package is initialized.
// `basePath` is path to bot directory.
// `cli` is main bot client object. If the package contains something that would try to token-grab the bot, it will be rejected. 
// if your package adds custom commands, you can add them to command list for users to know what it does. client.cmdList["command name"] = "description"
exports.Init = function (args, chan, basePath, cli) {
    cli.cmdList["hi"] = "says hi";
    cli.on("message", (message) => {
        if (message.content.startsWith("$hi")) {
            message.channel.send("Hello!");
        }
    });
};

// if you want your package to be updated you may want to add this:
exports.Version = 0.2