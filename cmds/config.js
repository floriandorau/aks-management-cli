exports.command = 'config <command>';
exports.desc = 'Manage aks configuration';
exports.builder = (yargs) => {
    yargs
        .usage('Usage: $0 config <command>')
        .example('$0 config show', 'prints your current config')
        .commandDir('config_cmds');
};
