exports.command = 'context <command>';
exports.desc = 'Manage stored context configurations';
exports.builder = (yargs) => {
    yargs
        .usage('Usage: $0 context <command> [options]')
        //.example('$0 context active <name>', 'set your active subscription in config')
        .commandDir('context_cmds');
};