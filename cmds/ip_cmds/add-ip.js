const { addIp } = require('../../src/cli');

exports.command = 'add <ip>';
exports.desc = 'Adds <ip> to AKS authorized ip-ranges';
exports.builder = (yargs) => {
    yargs.positional('ip', {
        describe: 'ip to add from authorized ip-ranges',
        type: 'string',
    });
};
exports.handler = (argv) => addIp(argv.ip);
