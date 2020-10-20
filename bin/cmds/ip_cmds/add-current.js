const { addCurrentIp } = require('../../../src/cli');

exports.command = 'add current-ip'
exports.desc = 'Adds your current public to AKS specified ip-range'
exports.builder = {}
exports.handler = function (argv) {
    const { cluster, resourceGroup, subscription } = argv;
    addCurrentIp({ cluster, resourceGroup, subscription })
}