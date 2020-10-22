const { addCurrentIp } = require('../../src/cli');

exports.command = 'add-current';
exports.desc = 'Adds your current public ip to AKS authorized ip-range';
exports.builder = () => { };
exports.handler = function (argv) {
    const { cluster, resourceGroup, subscription } = argv;
    addCurrentIp({ cluster, resourceGroup, subscription });
};