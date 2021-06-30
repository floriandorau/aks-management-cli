const { initConfig } = require('../../src/cli');

exports.command = 'init';
exports.desc = 'Initializes app diretory with empty config.yml';
exports.builder = () => { };
exports.handler = () => initConfig();