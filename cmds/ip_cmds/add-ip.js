import { addIp } from '../../src/cli.js';

export default {
    command: 'add <ip>',
    desc: 'Adds <ip> to AKS authorized ip-ranges',
    builder: (yargs) => {
        yargs.positional('ip', {
            describe: 'ip to add from authorized ip-ranges',
            type: 'string',
        });
    },
    handler: (argv) => addIp(argv.ip),
};
