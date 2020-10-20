exports.command = 'subscription <command>'

exports.desc = 'Manage subscriptions'

exports.builder = function (yargs) {
    return yargs.commandDir('subscription_cmds')
}

exports.handler = function (argv) { }