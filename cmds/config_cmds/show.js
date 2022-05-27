import { showConfig } from '../../src/cli.js';

export default {
    command: 'show',
    desc: 'Prints your current configuration',
    handler: () => showConfig(),
};
