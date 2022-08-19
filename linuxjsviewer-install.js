/* eslint-disable no-unused-vars */
const http = require('node:http');
const serverAndSocket = {
    /**
     * @type {http.Server}
     */
    "server": null,
    /**
     * @type {*}
     */
    "socket": null,
    /**
     * @type {readline.Interface}
     */
    "rl": null,
};

exports.Init = function (args, chan, basePath, cli) {

    const debugMode = true;

    try {
        require.resolve("socket.io");
    }
    catch (e) {
        chan.send("Error: to bot owner: internal functions of `linuxjsviewer` need additional module in main install. `socket.io` is missing. Please install it using `npm install socket.io`.");
        console.log("!!!READ ME!!!: LinuxJSViewer needs additional module. Please install it using `npm install socket.io`.");
        return;
    }

    // const download = function (url, dest, cb) {
    //     const file = fs.createWriteStream(dest);
    //     http.get(url, function (response) {
    //         response.pipe(file);
    //         file.on('finish', function () {
    //             file.close(cb);
    //         });
    //     });
    // };

    // async function getAllResources() {
    //     const bent = require('bent');
    //     const getJSON = bent('json');
    //     const repoUrl = fs.readFileSync(cli.config).toString().split("\n")[1].split('=')[1].split("/")[fs.readFileSync(cli.config).toString().split("\n")[1].split('=')[1].split("/").length - 3] + "/" + "LinuxJSViewer";
    //     console.log(repoUrl);
    //     const str = getJSON("https://api.github.com/repos/" + repoUrl + "/git/trees/master/html-gui", null, { 'User-Agent': 'request' });
    //     const a = await str;
    //     //	console.log(a);
    //     const tree = await a.tree;
    //     const resources = [];
    //     for (let i = 0; i < tree.length; i++) {
    //         if (path.extname(tree[i].path) != ".html") { continue; }
    //         //	console.log(tree[i].path);
    //         // let ready = ;
    //         // fs.readdirSync(cli.aptProtectedDir + path.sep + "autorun").forEach(file => {
    //         //     // console.log(file);
    //         //     if (file == "empty.txt") { return; }
    //         //     // let addInstalled = false;
    //         //     // console.log(file)
    //         //     if (tree[i].path != file)
    //         //         return;
    //         //     // console.log(addInstalled)

    //         //     let package;
    //         //     try {
    //         //         package = require(cli.aptProtectedDir + path.sep + "autorun" + path.sep + file);
    //         //     }
    //         //     catch (error) {
    //         //         // message.channel.send("An unexpected error occurred while trying to run package: " + file);
    //         //         console.log(error);
    //         //     }
    //         //     // if (addInstalled) {
    //         //     ready += "/" + package.Version + " [installed]";
    //         //     // }
    //         //     // else {
    //         //     // }
    //         // });
    //         // console.log(ready)
    //         resources.push(tree[i].path);
    //     }
    //     return resources;
    // }
    // console.log(cli);
    const path = require('path');
    const fs = require('fs');
    const wget = require('wget-improved');
    // if (!fs.existsSync(basePath + path.sep + "html-gui")) {
    //     fs.mkdirSync(basePath + path.sep + "html-gui");
    //     const repoUrl = fs.readFileSync(cli.config).toString().split("\n")[1].split('=')[1].split("/")[fs.readFileSync(cli.config).toString().split("\n")[1].split('=')[1].split("/").length - 3] + "/" + "LinuxJSViewer";
    //     getAllResources().then(resources => {
    //         for (let i = 0; i < resources.length; i++) {
    //             download(repoUrl + "/html-gui/" + resources[i], basePath + path.sep + "html-gui" + path.sep + resources[i], function () {
    //                 console.log("Downloaded: " + resources[i]);
    //             });
    //         }
    //     });
    // }

    const resourceList = [
        "https://raw.githubusercontent.com/Davilarek/LinuxJSViewer/master/html-gui/taskbar-task-template.html",
        "https://github.com/Davilarek/LinuxJSViewer/raw/master/html-gui/taskbar.html",
        "https://github.com/Davilarek/LinuxJSViewer/raw/master/html-gui/window-template.html",
    ];
    // i'll work later on this /\
    // needs more portability, I was thinking about zip or something but it would need package for that

    if (!fs.existsSync(basePath + path.sep + "html-gui")) {
        fs.mkdirSync(basePath + path.sep + "html-gui");
    }

    for (let index = 0; index < resourceList.length; index++) {
        const element = resourceList[index];
        if (!fs.existsSync(basePath + path.sep + "html-gui" + path.sep + path.basename(element)))
            // cli.executeCommand(cli.fakeMessageCreator("$wget " + element));
            wget.download(element, basePath + path.sep + "html-gui" + path.sep + path.basename(element));
    }


    // warning bad code ahead
    // ( also gui server code ;) )

    cli.registerExternalCommand("startviewer", function () {
        const readline = require('readline');


        const port = 8080;

        const events = require('events');
        const em = new events.EventEmitter();

        let connected = false;

        // Create an HTTP server
        const server = http.createServer();

        serverAndSocket.server = server;

        // this is probably terribly wrong
        // but eh whatever
        const io = require("socket.io")(server, {
            cors: {
                origin: '*',
            },
        });

        // console.log(__filename);

        // server.on('upgrade', (req, socket, head) => {
        //     socket.write('HTTP/1.1 101 Switching Protocols\r\n' +
        //         'Upgrade: WebSocket\r\n' +
        //         'Connection: Upgrade\r\n' +
        //         '\r\n');
        //     if (debugMode) console.log("Client wants to upgrade");
        //     // socket.pipe(socket); // echo back
        //     socket.write("Hello, client!\r\n");
        // });

        // server.listen(port, '127.0.0.1', () => {
        let currentSocket = null;
        // let cli = {};
        // cli.guiEvents = em;

        let desktop = {
            /**
             * @type {Object.<string, TaskbarTask>}
             */
            windows: {},
        };
        const desktopDefault = {};
        Object.assign(desktopDefault, desktop);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        // may cause issues when not in debug mode

        // 5 minutes later: I just checked. It does.
        // TODO: fix readline interface being not closed

        // fix \/
        serverAndSocket.rl = rl;

        io.on('connection', function (socket) {
            if (connected) {
                socket.send(Date.now() + "{split}" + 'echo "only one connection allowed"');
                socket.disconnect(true);
                return;
            }
            // rl.reopen();
            desktop = desktopDefault;
            connected = true;
            currentSocket = socket;
            serverAndSocket["socket"] = socket;
            if (debugMode) console.log('A new connection has been established.');

            setTimeout(() => {
                socket.send(Date.now() + "{split}" + 'echo "connected OK"');
            }, 50);

            setTimeout(() => {
                if (debugMode) console.log("Creating desktop");
                createDesktopOnClient(socket);
            }, 1000);

            socket.on('message', function (chunk) {
                if (chunk.toString() == 'closing') {
                    connected = false;
                    em.removeAllListeners('guiEvent');
                    return;
                }
                if (debugMode) console.log(`Data received from client:` + chunk.toString());
                em.emit('guiEvent', chunk.toString());
            });

            socket.on('disconnect', function (reason) {
                if (reason == "transport error") {
                    // rl.close();
                    if (debugMode) console.log("Client disconnected (I guess?)");
                    connected = false;
                    currentSocket = null;
                    serverAndSocket["socket"] = null;
                    return;
                }

                if (debugMode) console.log('Closing connection with the client');
                currentSocket = null;
                serverAndSocket["socket"] = null;
                // rl.close();
            });
            if (debugMode) repeatQuestion(socket);
            // socket.on('error', function (err) {
            //     if (debugMode) console.log(`${err}`);
            //     socket.disconnect(true);
            //     rl.close();
            //     if (err.code == 'ECONNRESET') {
            //         if (debugMode) console.log("Client disconnected (I guess?)");
            //         connected = false;
            //     }
            // });

        });
        function repeatQuestion(socket) {
            rl.question('Command: ', function (execute) {
                if (debugMode) console.log(`Command received: ${execute}`);
                if (execute.split(" ")[0] == "eval") {
                    eval(execute.split(" ")[1]);
                    repeatQuestion(socket);
                }
                else {
                    execute = execute.replace("{now}", Date.now() + "{split}");
                    socket.send(execute);

                    repeatQuestion(socket);
                }
            });
        }

        function processHtmlFromFileSync(filename) {
            let html = fs.readFileSync(basePath + path.sep + "html-gui" + path.sep + filename + ".html", 'utf8');
            // replace \n with \\n and \r with \\r in html
            html = html.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
            return html;
        }

        function processBinaryFromFileSync(filename) {
            let bin = fs.readFileSync("bin" + path.sep + filename, 'utf8');
            bin = bin.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
            return bin + '';
        }

        function executeBinary(filename) {
            // require("." + path.sep + "bin" + path.sep + filename + ".js");
            // return Function('return (' + processBinaryFromFileSync(filename) + ')')();
            eval(fs.readFileSync(basePath + path.sep + filename) + '');
        }

        function renderOnClient(socket, filename) {
            if (debugMode) console.log("Rendering " + filename);
            // if (debugMode) console.log(socket);
            socket.send(Date.now() + "{split}add-html " + processHtmlFromFileSync(filename));
        }

        function createDesktopOnClient(socket) {
            renderOnClient(socket, "taskbar");
            listenForTaskbarButtons(socket);
        }

        function addWindowTitle(socket, elementId, title) {
            socket.send(Date.now() + "{split}mod-html " + elementId + "{splitData}3\\0\\0{splitData}textContent{splitData}" + title);
        }

        function addWindowContent(socket, elementId, content) {
            socket.send(Date.now() + "{split}mod-html " + elementId + "{splitData}4\\0{splitData}textContent{splitData}" + content);
        }

        function addTaskbarTask(socket, elementId, title, icon, windowId, rename = false) {
            socket.send(Date.now() + "{split}mod-html " + elementId + "{splitData}0\\0\\0{splitData}textContent{splitData}" + title + "{splitInfo}" + windowId);
            if (!rename) {
                setTimeout(() => {
                    // newStyle = multiply style.left

                    getXMLData(socket, elementId).then(function (data) {
                        // if (debugMode) console.log(data["style"]);

                        let currentStyle;
                        for (let index = 0; index < data.attributes.length; index++) {
                            const element = data.attributes[index];
                            if (element[0] == "style") {
                                currentStyle = element[1].split("; ");
                            }
                        }
                        // convert currentStyle to object with key:value
                        const styleObject = {};
                        for (let index = 0; index < currentStyle.length; index++) {
                            const element = currentStyle[index];
                            if (element.indexOf(":") > -1) {
                                const key = element.split(":")[0];
                                const value = element.split(": ")[1];
                                styleObject[key] = value;
                            }
                        }
                        if (debugMode) console.log(styleObject);
                        if (debugMode) console.log(desktop.windows);
                        const howManyTimes = Object.keys(desktop.windows).length;


                        const newStyle = { left: styleObject.left.split("%")[0] * howManyTimes + "%" };
                        // var newStyle = { ...styleObject, left: styleObject.left.split("%")[0] * 2 + "%" };

                        socket.send(Date.now() + "{split}mod-html " + elementId + "{splitData}use-base-html{splitData}style{splitData}" + "style_" + JSON.stringify(newStyle) + "_{JSON_END}" + "{splitInfo}" + windowId);
                    });
                }, 100);
            }

            // findTaskbarTaskByWindowId(windowId, desktop.windows).getHTMLData().style

            // setTimeout(() => {
            //     socket.write(Date.now() + "{split}mod-html " + elementId + "{splitData}use-base-html{splitData}style{splitData}" + "");
            // }, 50);
            //  socket.write(Date.now() + "{split}mod-html " + elementId + "{splitData}0\\1\\0{splitData}src{splitData}" + icon);
        }

        function getXMLData(socket, elementId) {
            return new Promise((resolve, reject) => {
                socket.send(Date.now() + "{split}get-xml-data " + elementId);
                socket.on('message', function (chunk) {
                    if (chunk.toString().split(" ")[0] == "xml-data" && chunk.toString().split(" ")[1].split("{split}")[0] == elementId) {
                        // if (debugMode) console.log("aaaaaaaaa" + chunk.toString() + "aaaaaaaaa");
                        if (debugMode) console.log("XML data received");
                        resolve(JSON.parse(chunk.toString().split("{split}")[1]));
                        // resolve(JSON.parse(chunk.toString().split(" ")[2]));
                        socket.removeListener('message', arguments.callee);
                    }
                });
            });
        }

        function setWindowSize(socket, elementId, width, height) {
            const currentStyle = findTaskbarTaskByWindowId(elementId, desktop.windows).getHTMLData()["style"];
            const newStyle = { ...currentStyle, width: width, height: height };

            socket.send(Date.now() + "{split}mod-html " + elementId + "{splitData}use-base-html{splitData}style{splitData}" + "style_" + JSON.stringify(newStyle) + "_{JSON_END}");
        }

        function executeJSOnClient(socket, js) {
            socket.send(Date.now() + "{split}eval " + js);
        }

        function createWindowOnClient(socket, windowTitle, windowIcon) {
            return new Promise((resolve, reject) => {
                if (windowTitle == "") {
                    windowTitle = "New Window";
                }

                renderOnClient(socket, "window-template");
                em.on('guiEvent', function (data) {
                    if (data.split(" ")[0] == "window-rendered") {
                        addWindowTitle(socket, data.split(" ")[2], windowTitle);
                        setTimeout(() => {
                            desktop.windows[windowTitle + Object.keys(desktop.windows).length.toString()] = new TaskbarTask(data.split(" ")[2], windowTitle, windowIcon);
                            renderTaskInTaskbar(socket, { windowId: data.split(" ")[2], windowTitle: windowTitle, windowIcon: "" });
                            if (debugMode) console.log(Object.keys(desktop.windows).length.toString());
                            getXMLData(socket, data.split(" ")[2]).then(function (data2) {
                                desktop.windows[windowTitle + (Object.keys(desktop.windows).length - 1).toString()].setHTMLData(data2);
                                // setTimeout(() => {
                                //     renameDuplicateWindows(socket, desktop.windows);
                                // }, 250);
                                resolve(data.split(" ")[2]);
                            });
                        }, 50);
                        // renderTaskInTaskbar(socket, { windowId: data.split(" ")[2], windowTitle: windowTitle, windowIcon: createIcon(windowIcon) });
                        em.removeListener('guiEvent', arguments.callee);
                    }
                });
            });
        }

        // /**
        //  *
        //  * @param {Object.<string, TaskbarTask>} windowCollection
        //  */
        // function renameDuplicateWindows(socket, windowCollection) {
        //     // check every window in the collection for a duplicate title alphabetically
        //     // if a duplicate is found, rename the window to x + n
        //     if (debugMode) console.log(windowCollection);
        //     // var windows = Object.values(windowCollection);
        //     // if (debugMode) console.log(windows);
        //     // for (var i = 0; i < windows.length; i++) {
        //     //     var window = windows[i];
        //     //     if (debugMode) console.log("Checking window " + window);
        //     //     for (var j = i + 1; j < windows.length; j++) {
        //     //         if (windowCollection[window].getWindowTitle() == windowCollection[windows[j]].getWindowTitle()) {
        //     //             addWindowTitle(socket, windowCollection[window].getWindowId(), windowCollection[window].getWindowTitle() + " (x" + (j + 1) + ")");
        //     //             windowCollection[window].setWindowTitle(windowCollection[window].getWindowTitle() + " (x" + (j + 1) + ")");
        //     //             windowCollection[window].updateWindowTitle();
        //     //             if (debugMode) console.log("Renamed window " + window + " to " + windowCollection[window].getWindowTitle());
        //     //         }
        //     //     }
        //     // }
        //     // /\ use for var item in windowCollection
        //     for (var item in windowCollection) {
        //         var window = windowCollection[item];
        //         if (debugMode) console.log("Checking window ");
        //         if (debugMode) console.log(window);
        //         var i = 0;
        //         for (var item2 in windowCollection) {
        //             var window2 = windowCollection[item2];
        //             if (debugMode) console.log("Checking window ");
        //             if (debugMode) console.log(window2);
        //             if (window.getWindowTitle() == window2.getWindowTitle() && window.getWindowId() != window2.getWindowId()) {
        //                 i++;
        //                 addWindowTitle(socket, window.getWindowId(), window.getWindowTitle() + " " + i);
        //                 window.setWindowTitle(window.getWindowTitle() + " " + i);
        //                 window.updateWindowTitle();
        //                 if (debugMode) console.log("Renamed window " + window.getWindowId() + " to " + window.getWindowTitle());
        //             }
        //         }
        //     }
        // }

        // time / id: milliseconds since epoch (Date.now()) - id of the element

        // task: windowId, windowTitle, windowIcon
        function renderTaskInTaskbar(socket, task) {
            renderOnClient(socket, "taskbar-task-template");
            em.on('guiEvent', function (data) {
                if (data.split(" ")[0] == "taskbar-task-rendered") {
                    // addTaskbarTask(socket, data.split(" ")[1], task.windowTitle, task.windowIcon);
                    addTaskbarTask(socket, data.split(" ")[1], task.windowTitle, "", task.windowId);
                    findTaskbarTaskByWindowId(task.windowId, desktop.windows).setTaskbarTaskId(data.split(" ")[1]);
                    em.removeListener('guiEvent', arguments.callee);
                }
            });
        }

        function listenForTaskbarButtons(socket) {
            em.on('guiEvent', function (data) {
                if (data.split(" ")[0] == "button-clicked") {
                    if (data.split(" ")[1].includes("taskbar-task-button")) {
                        if (debugMode) console.log("Taskbar task button " + data.split(" ")[2] + " clicked");
                        if (debugMode) console.log(data);
                        executeJSOnClient(socket, '$("#' + data.split(" ")[3] + '").toggle()');
                    }
                    else if (data.split(" ")[1].includes("taskbar-start-button")) {
                        if (debugMode) console.log("Taskbar start button " + data.split(" ")[2] + " clicked");
                    }
                }
                if (data.split(" ")[0] == "window-close") {
                    if (debugMode) console.log("Window " + data.split(" ")[1] + " closed");
                    const task = findTaskbarTaskByWindowId(data.split(" ")[1], desktop.windows);
                    if (task != null) {
                        task.closeWindow();
                    }
                }
            });
        }
        // let objects = {};
        // em.on('guiEvent', function (data) {
        //     if (data.split(" ")[0].endsWith("-rendered")) {
        //         objects[data.split(" ")[1]] = data.split(" ")[2];
        //     }
        // });
        // 21:45 19.05.2022 - i think i gave up on this... please, someone find a way to send LARGE data over tcp without chunking...

        // function createIcon(iconPath) {
        //     const fs = require("fs");
        //     const path = require("path");
        //     return `data:image/${path.extname(iconPath).split('.').pop()};base64,${Buffer.from(fs.readFileSync(iconPath), 'binary').toString('base64')}`
        // }

        // });

        // https://gist.github.com/DannyNemer/29dc7b636e3518071e6f
        // Re-opens the readline `Interface` instance. Regains control of the `input` and `output` streams
        // by restoring listeners removed by the "close" event.
        // rl.reopen = (function () {
        //     // Change one time event listener for "close" event to a normal event listener.
        //     var onclose = rl.listeners('close')[0]
        //     rl.removeListener('close', onclose)
        //     rl.on('close', onclose.listener)

        //     // Save the `input` and `output` listeners which are removed by the "close" event.
        //     var onkeypress = rl.input.listeners('keypress')[0]
        //     var ontermend = rl.input.listeners('end')[1]
        //     var onresize = rl.output.listeners('resize')[0]

        //     return function () {
        //         if (!this.closed) return

        //         this.resume()

        //         if (this.terminal) {
        //             this._setRawMode(true)
        //         }

        //         this.closed = false

        //         // Restore `input` listeners.
        //         this.input.on('keypress', onkeypress)
        //         this.input.on('end', ontermend)

        //         // Restore `output` listener.
        //         if (this.output !== null && this.output !== undefined) {
        //             this.output.on('resize', onresize)
        //         }
        //     }
        // })()

        /**
         *
         * @param {*} name
         * @param {Object.<string, TaskbarTask>} windowList
         * @returns {TaskbarTask}
         */
        function findTaskbarTaskByName(name, windowList) {
            for (let i = 0; i < Object.keys(windowList).length; i++) {
                if (Object.values(windowList)[i].title == name) {
                    return Object.values(windowList)[i];
                }
            }
            return null;
        }

        /**
         *
         * @param {*} socket
         * @param {TaskbarTask} window
         */
        function closeWindow(socket, window) {
            const windowId = window.getWindowId();
            const taskbarId = window.getTaskbarTaskId();

            // send can't (SHOULDN'T) happen in the same millisecond, so we need to wait a bit
            socket.send(Date.now() + "{split}remove-html " + windowId);
            setTimeout(function () {
                socket.send(Date.now() + "{split}remove-html " + taskbarId);
            }, 50);
        }

        /**
         *
         * @param {*} id
         * @param {Object.<string, TaskbarTask>} windowList
         * @returns {TaskbarTask}
         */
        function findTaskbarTaskByWindowId(id, windowList) {
            // if (debugMode) console.log(windowList);
            const windows = Object.values(windowList);
            // if (debugMode) console.log(windows);
            for (let i = 0; i < windows.length; i++) {
                const window = windows[i];
                // if (debugMode) console.log("Checking window " + window);
                if (window.getWindowId() == id) {
                    return window;
                }
            }
            return null;
        }

        class TaskbarTask {
            constructor(windowId, windowTitle, windowIcon) {
                this.windowId = windowId;
                this.windowTitle = windowTitle;
                this.windowIcon = windowIcon;
            }

            getWindowId() {
                return this.windowId;
            }

            getWindowTitle() {
                return this.windowTitle;
            }

            getWindowIcon() {
                return this.windowIcon;
            }

            setWindowTitle(windowTitle) {
                this.windowTitle = windowTitle;
            }

            updateWindowTitle() {
                addWindowTitle(currentSocket, this.windowId, this.windowTitle);
                addTaskbarTask(currentSocket, this.taskbarTaskId, this.windowTitle, "", this.windowId, true);
            }

            setContent(content) {
                addWindowContent(currentSocket, this.windowId, content);
            }

            refreshHTMLData() {
                const html = getXMLData(currentSocket, this.windowId);
                this.htmlData = html;
                return html;
            }

            setHTMLData(data) {
                this.htmlData = data;
            }

            getHTMLData() {
                return this.htmlData;
            }

            setTaskbarTaskId(id) {
                this.taskbarTaskId = id;
            }

            getTaskbarTaskId() {
                return this.taskbarTaskId;
            }

            closeWindow() {
                for (const item in desktop.windows) {
                    if (desktop.windows[item].getWindowId() == this.windowId) {
                        delete desktop.windows[item];
                    }
                }
                closeWindow(currentSocket, this);
                // remove from desktop.windows

            }
        }

        server.listen(port, () => {
            if (debugMode) console.log(`Server is listening on port ${port}`);
            chan.send("Server is running on port " + port);
        });
    }, "launches GUI server");
};

exports.OnClose = function () {
    if (serverAndSocket.socket != null) {
        serverAndSocket.socket.send(Date.now() + "{split}echo \"Server is closing\"");
        serverAndSocket.socket.disconnect(true);
    }
    if (serverAndSocket.server != null) {
        serverAndSocket.server.close();
    }
    if (serverAndSocket.rl != null) {
        serverAndSocket.rl.close();
    }
    // serverAndSocket.server.close();
};

exports.Version = "4.9";
