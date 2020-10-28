const { removeSubscription } = require('../../src/cli');

exports.command = 'remove <name>';
exports.desc = 'Removes subscription with with <name> from config';
exports.builder = () => { };
exports.handler = (argv) => removeSubscription(argv.name);