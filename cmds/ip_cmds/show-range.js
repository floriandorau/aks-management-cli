const { listIpRange } = require('../../src/cli');

exports.command = 'show-range';
exports.desc = 'Prints current ip-range setting of AKS';
exports.builder = () => { };
exports.handler = (argv) => {
    const { cluster, resourceGroup, subscription } = argv;
    listIpRange({ cluster, resourceGroup, subscription });
};