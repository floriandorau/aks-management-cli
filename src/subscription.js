const { readConfig, writeConfig } = require('./util/config');
let config = readConfig();

const list = function () {
    if (!config || config.subscriptions?.length === 0) {
        return console.log('No subscriptions configured');
    }

    config.subscriptions.forEach(subscription => console.log(subscription));
};

const add = function (name, subscriptionId) {
    try {
        if (config && config.subscriptions) {
            const subscription = config.subscriptions.filter(subsc => name in subsc)[0];
            if (subscription) {
                console.log(`Subscription with name '${name}' already exists: '${subscriptionId}'`);
            } else {
                config.subscriptions.push({ [name]: subscriptionId });
            }
        } else {
            config = {
                subscriptions: [{ [name]: subscriptionId }]
            };
        }
        writeConfig(config);
    } catch (err) {
        console.error('Error while adding subscription', err);
    }
};

const remove = function (name) {
    try {
        if (config && config.subscriptions) {
            const subscriptions = config.subscriptions.filter(subsc => !(name in subsc));
            config.subscriptions = subscriptions;

            if (config.activeSubscription && name in config.activeSubscription) {
                console.log(`Subscription '${name}' is set as active. Resetting active subscription`);
                config.activeSubscription = null;
            }
        }
        writeConfig(config);
    } catch (err) {
        console.error('Error while removing subscription', err);
    }
};

const setActive = function (name) {
    try {
        if (config && config.subscriptions) {
            const subscription = config.subscriptions.filter(subsc => name in subsc)[0];
            if (subscription) {
                config.activeSubscription = subscription;
                writeConfig(config);
                console.log(`Set '${JSON.stringify(subscription)}' as active subscription`);
            } else {
                console.log(`No subscription configured with name '${name}'. Try to add a subscription first using 'add' command`);
            }
        } else {
            console.log('No subscriptions configured. Try to add a subscription first');
        }

    } catch (err) {
        console.error('Error while setting active subscription', err);
    }
};

const getActive = function () {
    if (!config || !config.activeSubscription) {
        return console.log('No active subscription set');
    }
    console.log(`Current active subscription: '${JSON.stringify(config.activeSubscription)}'`);
};

module.exports = { add, list, getActive, setActive, remove };