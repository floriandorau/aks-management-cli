const { add } = require('../../src/subscription');

exports.command = 'add <name> <subscription-id>';
exports.desc = 'Add <subscription-id> to config with <name>';
exports.builder = () => { };
exports.handler = (argv) => add(argv.name, argv.subscriptionId);