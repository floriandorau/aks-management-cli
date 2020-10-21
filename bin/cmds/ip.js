exports.command = 'ip <command>';
exports.desc = 'Manage ips';
exports.builder = (yargs) => yargs.commandDir('ip_cmds');
exports.handler = () => { };