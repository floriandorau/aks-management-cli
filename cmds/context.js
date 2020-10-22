const { getCurrentContext } = require('../src/cli');

exports.command = 'current-context';
exports.desc = 'Prints your current configured kubectl context';

exports.builder = () => { };

exports.handler = () => getCurrentContext();