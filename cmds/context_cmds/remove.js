const { remove } = require('../../src/context');

exports.command = 'remove <name>';
exports.desc = 'Removes context with <name> from config';
exports.builder = () => {};
exports.handler = (argv) => remove(argv.name);
