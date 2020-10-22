const { activeSubscription } = require('../../src/cli');

exports.command = 'active';
exports.desc = 'Prints your current active subscription';
exports.builder = () => { };
exports.handler = () => activeSubscription();