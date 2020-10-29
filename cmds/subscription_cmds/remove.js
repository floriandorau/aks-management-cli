const { remove } = require('../../src/subscription');

exports.command = 'remove <name>';
exports.desc = 'Removes subscription with with <name> from config';
exports.builder = () => { };
exports.handler = (argv) => remove(argv.name);