exports.command = 'subscription <command>';
exports.desc = 'Manage subscriptions';
exports.builder = (yargs) => yargs.commandDir('subscription_cmds');