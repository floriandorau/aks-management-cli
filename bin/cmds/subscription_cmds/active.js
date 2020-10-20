const { activeSubscription } = require('../../../src/cli');

exports.command = 'active'
exports.desc = 'Prints the current active subscription'
exports.builder = {}
exports.handler = function () {
    activeSubscription();
}