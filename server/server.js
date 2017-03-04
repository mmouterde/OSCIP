const spawn = require('child_process').spawn;
const express = require('express');
const sanitize = require("sanitize-filename");
const Promise = require("bluebird");
const path = require("path");
const fs = Promise.promisifyAll(require("fs-extra"));
const crypto = require("crypto");
const http = require("http");
const bodyParser = require('body-parser');

let app = express();
let server = http.createServer(app);
let io = require('socket.io')(server);

app.use('/api', bodyParser.json());
app.use(express.static('../public'));

app.post('/api/:organization/:project/builds', function (req, res) {
    const dockerTag = crypto.randomBytes(16).toString("hex");
    res.json({pid: dockerTag});
    const workingDir = path.join('./workspaces', sanitize(req.params.organization + '_' + req.params.project));
    createWorkspace(workingDir).then(function () {
        return retreiveDockerFile(req.body.dockerFileURL, workingDir);
    }).then(function () {
        return runBuild(workingDir, req.body.gitRepo, logCallBack, dockerTag);
    }).then(function () {
        return runTest(workingDir, dockerTag, logCallBack);
    });
    function logCallBack(data) {
        console.log(data);
        io.sockets.emit(dockerTag, {msg: data});
    }
});

server.listen(9000, function () {
    console.log("listen on 9000");
});

function createWorkspace(workingDir) {
    return fs.ensureDirAsync(workingDir);
}

function retreiveDockerFile(dockerFileURL, workingDir) {
    return new Promise(function (resolve, reject) {
        let file = fs.createWriteStream(path.join(workingDir, "Dockerfile"));
        let request = http.get(dockerFileURL, function (response) {
            response.pipe(file);
            response.on('end', function () {
                resolve();
            });
            response.on('aborted', function (error) {
                reject(error);
            });
        });
    });
}

function runTest(workingDirectory, dockerTag, logCallback) {
    return new Promise(function (resolve, reject) {

        //const buildProcess = spawn('docker', ['run', dockerTag, '--rm', '-v', './output:./output'], {cwd: workingDirectory});
        const buildProcess = spawn('node', ['--version'], {cwd: workingDirectory});

        buildProcess.stdout.on('data', data => {
            logCallback(`OUT ${data}`);
        });

        buildProcess.stderr.on('data', data => {
            logCallback(`ERR ${data}`);
        });

        buildProcess.on('close', code => {
            if (code === 0) {
                resolve(0);
            } else {
                reject(code);
            }
        });
    });
}

function runBuild(workingDirectory, gitRepo, logCallback, dockerTag) {
    return new Promise(function (resolve, reject) {

        //const buildProcess = spawn('docker', ['build', '.', '--build-arg', 'GIT_REPO=' + gitRepo, '-t', dockerTag], {cwd: workingDirectory});
        const buildProcess = spawn('node', ['--version'], {cwd: workingDirectory});

        buildProcess.stdout.on('data', data => {
            logCallback(`OUT ${data}`);
        });

        buildProcess.stderr.on('data', data => {
            logCallback(`ERR ${data}`);
        });

        buildProcess.on('close', code => {
            if (code === 0) {
                resolve(0);
            } else {
                reject(code);
            }
        });
    });
}