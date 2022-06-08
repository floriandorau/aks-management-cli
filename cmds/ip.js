import { commands } from './ip_cmds/index.js';

export default {
    command: 'ip <command>',
    desc: 'Manage authorized ip range of managed Kubernetes cluster',
    builder: (yargs) => {
        return yargs.usage('Usage: $0 ip <command>').command(commands);
    },
};
