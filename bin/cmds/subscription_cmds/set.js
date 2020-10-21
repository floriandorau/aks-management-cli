const { setActiveSubscription } = require('../../../src/cli');

exports.command = 'set <name>';
exports.desc = 'Set <sname> as the current active subscription';
exports.builder = () => { };
exports.handler = (argv) => setActiveSubscription(argv.name);