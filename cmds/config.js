import { commands } from './config_cmds/index.js';

export default {
    command: 'config <command>',
    desc: 'Manage aks configuration',
    builder: (yargs) => {
        yargs
            .usage('Usage: $0 config <command>')
            .example('$0 config show', 'prints your current config')
            .command(commands);
    },
};
