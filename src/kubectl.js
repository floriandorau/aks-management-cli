import { exec } from './util/cmd.js';
import { readConfig } from './util/config.js';

export const buildClusterContext = async function () {
    const config = readConfig();
    const currentContext = await getCurrentContext();

    if (config && config.contexts) {
        const context = config.contexts.filter(
            (ctx) => currentContext in ctx
        )[0];
        if (!context) {
            throw Error(
                `No context with name '${currentContext}' configured. Try to add context first, check 'aks context add help'`
            );
        }

        const { name, resourceGroup, subscriptionId } = context[currentContext];
        return { name, resourceGroup, subscription: subscriptionId };
    } else {
        throw Error(
            'Error while building cluster context. Could not read config.'
        );
    }
};

export const getCurrentContext = async function () {
    const currentContext = await exec('kubectl', ['config', 'current-context']);
    return currentContext.trim();
};
