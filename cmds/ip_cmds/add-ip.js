const { addIp } = require('../../src/cli');

exports.command = 'add <ip>';
exports.desc = 'Adds <ip> to AKS authorized ip-ranges';
exports.builder = (yargs) => {
    yargs.positional('ip', {
        describe: 'ip to add from authorized ip-ranges',
        type: 'string'
    });
};
exports.handler = (argv) => {
    const { cluster, resourceGroup, subscription } = argv;
    addIp(argv.ip, { cluster, resourceGroup, subscription });
};