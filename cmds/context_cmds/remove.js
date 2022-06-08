import { remove } from '../../src/context.js';

export default {
    command: 'remove <name>',
    desc: 'Removes context with <name> from config',
    handler: (argv) => remove(argv.name),
};
