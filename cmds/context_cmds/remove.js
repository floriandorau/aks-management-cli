import { remove } from '../../src/context.js';

export default {
    command: 'remove <name>',
    desc: 'Removes context with <name> from config',
    builder: () => {},
    handler: (argv) => remove(argv.name),
};
