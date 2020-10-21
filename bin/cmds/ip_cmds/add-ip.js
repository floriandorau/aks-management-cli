const { addIp } = require('../../../src/cli');

exports.command = 'add <ip>';
exports.desc = 'Add <ip> to AKS specified ip-range';
exports.builder = () => { };
exports.handler = (argv) => {
    const { cluster, resourceGroup, subscription } = argv;
    addIp(argv.ip, { cluster, resourceGroup, subscription });
};