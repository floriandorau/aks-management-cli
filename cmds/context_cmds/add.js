import { add } from '../../src/context.js';

export default {
    command: 'add <cluster-name> <resource-group> <subscription-id>',
    desc: 'Adds cluster with <cluster-name> of <resource-group> in <subscription-id> to config',
    handler: (argv) =>
        add(argv.clusterName, argv.resourceGroup, argv.subscriptionId),
};
