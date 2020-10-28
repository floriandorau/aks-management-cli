const { removeIp } = require('../../src/cli');

exports.command = 'rm <ip>';
exports.desc = 'Removes <ip> from AKS authorized ip-ranges';
exports.builder = (yargs) => {
    yargs.positional('ip', {
        describe: 'ip to remove from authorized ip-ranges',
        type: 'string'
    });
};
exports.handler = (argv) => {
    const { cluster, resourceGroup, subscription } = argv;
    removeIp(argv.ip, { cluster, resourceGroup, subscription });
};