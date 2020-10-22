const child_process = require('child_process');

const exec = (cmd, args, options = { debug: false }) => {
    if (options.debug) {
        console.debug(args);
    }

    const result = child_process.spawnSync(cmd, args);

    if (result.status !== 0) {
        throw new Error(result.stderr.toString('utf8'));
    }

    return result.stdout.toString('utf8');

};

module.exports = { exec };