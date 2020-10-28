exports.command = 'ip <command>';
exports.desc = 'Manage AKS authorized ip range';
exports.builder = (yargs) =>
    yargs
        .commandDir('ip_cmds')
        .usage('Usage: $0 ip <command> [options]')
        .options({
            'resource-group': {
                alias: 'r',
                describe: '(Optional) Resource Group name. If not specified current kubectl context will be used'
            },
            'cluster': {
                alias: 'c',
                describe: '(Optional) Cluster name. If not specified current kubectl context will be used'
            },
            'subscription': {
                alias: 's',
                describe: '(Optional) Subscription id. If not specified active subscription from config will be used'
            }
        });
exports.handler = () => { };