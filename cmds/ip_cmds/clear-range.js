import { clearIpRange } from '../../src/cli.js';

export default {
    command: 'clear-range',
    desc: 'Clears existing authorized ip-ranges of AKS',
    handler: () => clearIpRange(),
};
