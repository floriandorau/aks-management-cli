const { removeIp } = require('../../src/cli');

exports.command = 'remove <ip>';
exports.desc = 'Removes <ip> from AKS authorized ip-ranges';
exports.builder = (yargs) => {
    yargs.positional('ip', {
        describe: 'ip to remove from authorized ip-ranges',
        type: 'string',
    });
};
exports.handler = (argv) => {
    removeIp(argv.ip);
};
