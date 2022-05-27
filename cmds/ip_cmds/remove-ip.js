import { removeIp } from '../../src/cli.js';

export default {
    command: 'remove <ip>',
    desc: 'Removes <ip> from AKS authorized ip-ranges',
    builder: (yargs) => {
        yargs.positional('ip', {
            describe: 'ip to remove from authorized ip-ranges',
            type: 'string',
        });
    },
    handler: (argv) => {
        removeIp(argv.ip);
    },
};
