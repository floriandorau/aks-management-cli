import { showCurrentContext } from '../../src/cli.js';

export default {
    command: 'current',
    desc: 'Prints your current kubectl context',
    handler: () => showCurrentContext(),
};
