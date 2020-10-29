const { list } = require('../../src/subscription');

exports.command = 'list';
exports.desc = 'Lists all your configured subscriptions';
exports.builder = () => { };
exports.handler = () => list();