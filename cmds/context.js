import { commands } from './context_cmds/index.js';

export default {
    command: 'context <command>',
    desc: 'Manage aks context configurations',
    builder: (yargs) => {
        yargs.usage('Usage: $0 context <command>').command(commands);
    },
};
