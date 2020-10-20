const { getCurrentContext } = require('../../src/cli');

exports.command = 'context'

exports.desc = 'Prints current kubectl context'

exports.builder = function (yargs) { }

exports.handler = function (argv) { getCurrentContext() }