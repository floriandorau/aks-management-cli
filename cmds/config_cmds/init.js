import { initConfig } from '../../src/cli.js';

export default {
    command: 'init',
    desc: 'Initializes app diretory with empty config.yml',
    builder: () => {},
    handler: () => initConfig(),
};
