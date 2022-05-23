const { listIpRange } = require('../../src/cli');

exports.command = 'show-range';
exports.desc = 'Prints current authorized ip-range of AKS';
exports.builder = () => {};
exports.handler = () => listIpRange();
