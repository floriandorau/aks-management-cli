const child_process = require('child_process');

const exec = function (cmd, args, opts = {}) {
    const result = child_process.spawnSync(cmd, args);
    if (result.status === 0) {
        return result.stdout.toString('utf8');
    } else {
        console.log('stderr:', result.stderr.toString('utf8'));
        console.log('stdout:', result.stdout.toString('utf8'));
        throw new Error('Command failed!');
    }
};

module.exports = { exec };