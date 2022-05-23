const child_process = require('child_process');

const exec = (cmd, args, options = { debug: false }) => {
    const stdoutData = [];
    const stderrData = [];
    return new Promise((resolve, reject) => {
        if (options.debug) {
            console.debug(args);
        }

        const spawnedProcess = child_process.spawn(cmd, args);

        spawnedProcess.stdout.on('data', (data) => stdoutData.push(data));
        spawnedProcess.stderr.on('data', (data) => stderrData.push(data));
        spawnedProcess.on('error', (err) => reject(err));

        spawnedProcess.on('close', (code) => {
            if (options.debug) {
                console.debug(`process closed with code ${code}`);
            }

            if (stderrData.length > 0) {
                reject(Error(Buffer.concat(stderrData).toString('utf8')));
            }

            resolve(Buffer.concat(stdoutData).toString('utf8'));
        });
    });
};

module.exports = { exec };
