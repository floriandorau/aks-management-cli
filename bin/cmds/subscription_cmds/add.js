const { addSubscription } = require('../../../src/cli');

exports.command = 'add <name> <subscription-id>'
exports.desc = 'Add <subscription-id> as entry to config with <name>'
exports.builder = {}
exports.handler = function (argv) {
    const { name, subscriptionId } = argv;
    addSubscription(name, subscriptionId);
}