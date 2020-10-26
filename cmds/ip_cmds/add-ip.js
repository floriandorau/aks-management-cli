const { addIp } = require('../../src/cli');

exports.command = 'add <ip>';
exports.desc = 'Add <ip> to AKS specified ip-range';
exports.builder = (yargs) => {
    yargs.positional('ip', {
        describe: 'ip to add to authorized ip range',
        type: 'string'
    });
};
exports.handler = (argv) => {
    const { cluster, resourceGroup, subscription } = argv;
    addIp(argv.ip, { cluster, resourceGroup, subscription });
};