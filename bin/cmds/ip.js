exports.command = 'ip <command>'

exports.desc = 'Manage ips'

exports.builder = function (yargs) {
    return yargs.commandDir('ip_cmds')
}

exports.handler = function (argv) { }