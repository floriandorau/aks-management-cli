const { list } = require('../../src/context');

exports.command = 'list';
exports.desc = 'Lists all your configured contexts';
exports.builder = () => {};
exports.handler = () => list();
