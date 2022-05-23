const { initConfig } = require('../../src/cli');

exports.command = 'init';
exports.desc = 'Initializes app directory with empty config.yml';
exports.builder = () => { };
exports.handler = () => initConfig();