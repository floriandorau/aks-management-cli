exports.command = 'ip <command>';
exports.desc = 'Manage authorized ip range of managed Kubernetes cluster';
exports.builder = (yargs) =>
    yargs
        .commandDir('ip_cmds')
        .usage('Usage: $0 ip <command>');

exports.handler = () => { };