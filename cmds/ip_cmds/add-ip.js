const { addIp } = require('../../src/cli');

exports.command = 'add <ip>';
exports.desc = 'Adds <ip> to AKS authorized ip-range';
exports.builder = (yargs) => {
    yargs.positional('ip', {
        describe: 'ip to add as authorized ip',
        type: 'string'
    });
};
exports.handler = (argv) => {
    const { cluster, resourceGroup, subscription } = argv;
    addIp(argv.ip, { cluster, resourceGroup, subscription });
};