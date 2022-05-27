import { listIpRange } from '../../src/cli.js';

export default {
    command: 'show-range',
    desc: 'Prints current authorized ip-range of AKS',
    handler: () => listIpRange(),
};
