const { removeIp } = require('../../src/cli');

exports.command = 'remove <ip>';
exports.desc = 'Removes <ip> from AKS authorized ip-range';
exports.builder = (yargs) => {
    yargs.positional('ip', {
        describe: 'ip to remove as authorized ip',
        type: 'string'
    });
};
exports.handler = (argv) => {
    const { cluster, resourceGroup, subscription } = argv;
    removeIp(argv.ip, { cluster, resourceGroup, subscription });
};