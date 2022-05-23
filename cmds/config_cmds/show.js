const { showConfig } = require('../../src/cli');

exports.command = 'show';
exports.desc = 'Prints your current configuration';
exports.builder = () => {};
exports.handler = () => showConfig();
