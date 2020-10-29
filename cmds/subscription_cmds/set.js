const { setActive } = require('../../src/subscription');

exports.command = 'set <name>';
exports.desc = 'Set <name> as the current active subscription';
exports.builder = () => { };
exports.handler = (argv) => setActive(argv.name);