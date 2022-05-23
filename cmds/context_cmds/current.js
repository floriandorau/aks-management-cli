const { showCurrentContext } = require('../../src/cli');

exports.command = 'current';
exports.desc = 'Prints your current kubectl context';

exports.builder = () => {};

exports.handler = () => showCurrentContext();
