import { getCredentials } from '../src/cli.js';

export default {
    command: 'get-credentials',
    desc: 'Get access credentials for a managed Kubernetes cluster',
    handler: () => getCredentials(),
};
