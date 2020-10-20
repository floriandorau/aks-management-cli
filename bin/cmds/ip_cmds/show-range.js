const { showIpRange } = require('../../../src/cli');

exports.command = 'show-range'
exports.desc = 'Prints current ip-range setting of AKS'
exports.builder = {}
exports.handler = function (argv) {
    const { cluster, resourceGroup, subscription } = argv;
    listIpRange({ cluster, resourceGroup, subscription })
}