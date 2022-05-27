import { list } from '../../src/context.js';

export default {
    command: 'list',
    desc: 'Lists all your configured contexts',
    builder: () => {},
    handler: () => list(),
};
