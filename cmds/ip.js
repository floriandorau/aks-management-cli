exports.command = 'ip <command>';
exports.desc = 'Manage AKS cluster authorized ip range';
exports.builder = (yargs) =>
    yargs
        .commandDir('ip_cmds')
        .usage('Usage: $0 ip <command>');

exports.handler = () => { };