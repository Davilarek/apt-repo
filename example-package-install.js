// Every package needs to contain four arguments, otherwise it will be rejected.
// `args` are arguments passed while installing/initializing package.
// `chan` is a channel object collected when package is initialized.
// `basePath` is path to bot directory.
// `cli` is main bot client object. If the package contains something that would try to token-grab the bot, it will be rejected. 
exports.Init = function (args, chan, basePath, cli) {
    cli.on("message", (message) => {
        if (message.content.startsWith("$hi")) {
            message.channel.send("Hello!");
        }
    });
};