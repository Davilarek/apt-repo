// Every package needs to contain four arguments, otherwise it will be rejected.
// `args` are arguments passed while installing/initializing package.
// `chan` is a channel object collected when package is initialized.
// `basePath` is path to bot directory.
// `cli` is a set of tools you can use. look in LinuxJSEdition's code to see what can you use.
// if your package adds custom commands, you can add them to command list for users to know what it does. third parameter in `registerExternalCommand` is description of command. it's optional.
exports.Init = function (args, chan, basePath, cli) {
    // cli.cmdList["hi"] = "says hi";
    cli.registerExternalCommand("hi", (message) => {
        message.channel.send("Hello!");
    }, "says hi");
};

// called when package is updated.
exports.OnUpdate = function (args, chan) {
    chan.send("Hello! I've been updated!");
};

// if you want your package to be updated you may want to add this:
exports.Version = "0.5.1";
