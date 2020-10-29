const { getActive } = require('../../src/subscription');

exports.command = 'active';
exports.desc = 'Prints your current active subscription';
exports.builder = () => { };
exports.handler = () => getActive();