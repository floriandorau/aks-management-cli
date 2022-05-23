const { add } = require('../../src/context');

exports.command = 'add <cluster-name> <resource-group> <subscription-id>';
exports.desc =
    'Adds cluster with <cluster-name> of <resource-group> in <subscription-id> to config';
exports.builder = () => {};
exports.handler = (argv) => {
    add(argv.clusterName, argv.resourceGroup, argv.subscriptionId);
};
