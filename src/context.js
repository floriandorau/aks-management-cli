const { readConfig, writeConfig } = require('./util/config');
let config = readConfig();

const list = function () {
    if (!config || !config.contexts || config.contexts?.length === 0) {
        return console.log('No contexts configured.');
    }

    config.contexts.forEach(context => console.log(JSON.stringify(context, null, '  ')));
};

const add = function (name, resourceGroup, subscriptionId) {
    try {
        if (config && config.contexts) {
            const context = config.contexts.filter(context => name in context)[0];
            if (context) {
                console.log(`Context with name '${name}' already exists: '${JSON.stringify(context, null, '  ')} '`);
            } else {
                console.log(`Adding context '${resourceGroup}/${name}@${subscriptionId}'`);
                config.contexts.push({
                    [name]: {
                        name,
                        resourceGroup,
                        subscriptionId
                    }
                });
            }
        } else {
            console.log(`Adding context '${resourceGroup}/${name}@${subscriptionId}'`);
            config = {
                contexts: [{
                    [name]: {
                        name,
                        resourceGroup,
                        subscriptionId
                    }
                }]
            };
        }
        writeConfig(config);
    } catch (err) {
        console.error('Error while adding context', err);
    }
};

const remove = function (name) {
    try {
        if (config && config.contexts) {
            const contexts = config.contexts.filter(context => !(name in context));
            config.contexts = contexts;
        }
        writeConfig(config);
        console.log(`Removed context '${name}' from config`);
    } catch (err) {
        console.error(`Error while removing context '${name}'`, err);
    }
};

module.exports = { add, list, remove };