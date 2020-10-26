exports.command = 'subscription <command>';
exports.desc = 'Manage subscriptions';
exports.builder = (yargs) => {
    yargs
        .usage('Usage: $0 subscription <command> [options]')
        .example('$0 subscription active <name>', 'set your active subscription in config')
        .commandDir('subscription_cmds');
};