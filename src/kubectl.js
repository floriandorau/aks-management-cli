const { exec } = require('./util/cmd');
const { readConfig } = require('./util/config');

const buildClusterContext = async function () {
    const config = readConfig();
    const currentContext = await getCurrentContext();

    if (config && config.contexts) {
        const context = config.contexts.filter(ctx => currentContext in ctx)[0];
        return {
            name: context[currentContext].name,
            resourceGroup: context[currentContext].resourceGroup,
            subscription: context[currentContext].subscriptionId
        };
    } else {
        throw Error(`No context with name '${currentContext}' configured. Try to add context first.`);
    }

};

const getCurrentContext = async function () {
    const currentContext = await exec('kubectl', ['config', 'current-context']);
    return currentContext.trim();
};

module.exports = { buildClusterContext, getCurrentContext };
