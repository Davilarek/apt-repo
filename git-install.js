const { spawn } = require("child_process");

exports.Version = 1.2;

exports.Init = function (args, chan, basePath, cli) {
	cli.cmdList["git"] = "run bot-side git commands";
	cli.on("message", (message) => {
		if (message.content.startsWith("$git")) {
			let gitProcess = spawn("git", message.content.substring(message.content.indexOf(" ") + 1).split(" "));

			gitProcess.stdout.on("data", data => {
				console.log(`${data}`);
				message.channel.send(data.toString());
			});

			gitProcess.stderr.on("data", data => {
				console.log(`${data}`);
				message.channel.send(data.toString());
			});

			gitProcess.on('error', (error) => {
				console.log(`error: ${error.message}`);
			});

			gitProcess.on("close", code => {
				console.log(`child process exited with code ${code}`);
				message.channel.send("Process completed with code " + code + ".");
			});
		}
	});
};
