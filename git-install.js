const { spawn } = require("child_process");

exports.Init = function (args, chan, basePath, cli) {
	cli.on("message", (message) => {
		if (message.content.startsWith("$git")) {
			let ls = null;
			args = message.content.substring(message.content.indexOf(" ") + 1).split(" ");
			ls = spawn("git", args);

			ls.stdout.on("data", data => {
				console.log(`${data}`);
				message.channel.send(data.toString());
			});

			ls.stderr.on("data", data => {
				console.log(`${data}`);
				message.channel.send(data.toString());
			});

			ls.on('error', (error) => {
				console.log(`error: ${error.message}`);
			});

			ls.on("close", code => {
				console.log(`child process exited with code ${code}`);
				message.channel.send("Process completed with code " + code + ".");
			});
		}
	});
};