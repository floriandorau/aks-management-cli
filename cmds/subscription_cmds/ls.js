const { listSubscriptions } = require('../../src/cli');

exports.command = 'list';
exports.desc = 'Lists all your confifgured subscriptions';
exports.builder = () => { };
exports.handler = () => listSubscriptions();