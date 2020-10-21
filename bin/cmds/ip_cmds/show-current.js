const { showCurrentIp } = require('../../../src/cli');

exports.command = 'show-current';
exports.desc = 'Prints your current public ip address';
exports.builder = () => { };
exports.handler = () => showCurrentIp();