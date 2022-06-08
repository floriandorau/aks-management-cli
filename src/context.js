import { readConfig, writeConfig } from './util/config.js';

let config = readConfig();

export const list = function () {
    if (!config || !config.contexts || config.contexts?.length === 0) {
        return console.log('No contexts configured.');
    }

    config.contexts.forEach((context) =>
        console.log(JSON.stringify(context, null, '  '))
    );
};

export const saveAuthorizedIp = function (authorizedIp, { name }) {
    if (!config || !config.contexts || config.contexts?.length === 0) {
        return console.log('No contexts configured.');
    }

    const context = config.contexts.filter((ctx) => name in ctx)[0];
    context[name] = { ...context[name], authorizedIp };

    writeConfig(config);
};

export const removeAuthorizedIp = function (authorizedIp, { name }) {
    if (!config || !config.contexts || config.contexts?.length === 0) {
        return console.log('No contexts configured.');
    }

    const context = config.contexts.filter((ctx) => name in ctx)[0];

    if (context[name].authorizedIp === authorizedIp) {
        context[name] = { ...context[name], authorizedIp: undefined };
        writeConfig(config);
    }
};

export const add = function (name, resourceGroup, subscriptionId) {
    try {
        if (config && config.contexts) {
            const context = config.contexts.filter((ctx) => name in ctx)[0];
            if (context) {
                console.log(
                    `Context with name '${name}' already exists: '${JSON.stringify(
                        context,
                        null,
                        '  '
                    )} '`
                );
            } else {
                console.log(
                    `Adding context '${resourceGroup}/${name}@${subscriptionId}'`
                );
                config.contexts.push({
                    [name]: {
                        name,
                        resourceGroup,
                        subscriptionId,
                    },
                });
            }
        } else {
            console.log(
                `Adding context '${resourceGroup}/${name}@${subscriptionId}'`
            );
            config = {
                contexts: [
                    {
                        [name]: {
                            name,
                            resourceGroup,
                            subscriptionId,
                        },
                    },
                ],
            };
        }
        writeConfig(config);
    } catch (err) {
        console.error('Error while adding context', err);
    }
};

export const remove = function (name) {
    try {
        if (config && config.contexts) {
            const contexts = config.contexts.filter((ctx) => !(name in ctx));
            config.contexts = contexts;
        }
        writeConfig(config);
        console.log(`Removed context '${name}' from config`);
    } catch (err) {
        console.error(`Error while removing context '${name}'`, err);
    }
};
