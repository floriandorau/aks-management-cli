const { listSubscriptions } = require('../../../src/cli');

exports.command = 'ls'
exports.desc = 'Lists all confifgured subscription ids with its name'
exports.builder = {}
exports.handler = function (argv) {
    listSubscriptions();
}