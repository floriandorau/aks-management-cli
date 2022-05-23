exports.command = 'context <command>';
exports.desc = 'Manage aks context configurations';
exports.builder = (yargs) => {
    yargs.usage('Usage: $0 context <command>').commandDir('context_cmds');
};
