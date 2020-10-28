const child_process = require('child_process');

const exec = (cmd, args, options = { debug: false }) => {
    const stdoutData = [];
    return new Promise((resolve, reject) => {
        if (options.debug) {
            console.debug(args);
        }

        const spawnedProcess = child_process.spawn(cmd, args);

        spawnedProcess.stdout.on('data', data => {
            stdoutData.push(data);
        });

        spawnedProcess.on('error', err => reject(err));

        spawnedProcess.on('close', code => {
            if (options.debug) {
                console.debug(`processed close with code ${code}`);
            }

            resolve(Buffer.concat(stdoutData).toString('utf8'));
        });
    });
};

module.exports = { exec };