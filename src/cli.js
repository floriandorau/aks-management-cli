const az = require('./azure');
const isIp = require('is-ip');
const { exec } = require('./cmd');

const { readConfig, writeConfig } = require('./config');

let config = readConfig();

const addIp = function (ip, { cluster, resourceGroup, subscription }) {
    try {
        if (isIp.v4(ip)) {
            console.log(`Adding ${ip} to azure ip whitelist`);
            az.addIp(ip, _buildOptions({ cluster, resourceGroup, subscription }));
            console.log(`Ip ${ip} added to authorrized ip range`);
        } else {
            console.log(`'${ip}' is  no valid IPv4 address.`);
        }

    } catch (err) {
        console.error('Error while adding ip address', err);
    }
};

const addCurrentIp = function ({ cluster, resourceGroup, subscription }) {
    try {
        const currentIp = _getCurrentIp();
        az.addIp(currentIp, _buildOptions({ cluster, resourceGroup, subscription }));
        console.log(`Ip ${currentIp} added to authorrized ip range`);
    } catch (err) {
        console.error('Error while adding current ip address', err);
    }
};

const getCurrentContext = function () {
    try {
        const clusterContext = _getCurrentCluster();
        console.log(`Your current cluster context is: '${clusterContext}'`);
    } catch (err) {
        console.error('Error while reading cluster context', err);
    }
};

const showCurrentIp = function () {
    try {
        const ip = _getCurrentIp();
        console.log(`Your current ip address is: '${ip}'`);
    } catch (err) {
        console.error('Error while gathering your current ip address', err);
    }
};

const listIpRange = function ({ cluster, resourceGroup, subscription }) {
    try {
        const ipRanges = az.listIpRange(_buildOptions({ cluster, resourceGroup, subscription }));
        console.log(`Authorized ip ranges are: ${ipRanges}`);
    } catch (err) {
        console.error('Error while list ip range', err);
    }
};

const listSubscriptions = function () {
    try {
        if (config.subscriptions) {
            config.subscriptions.forEach(subscription => console.log(subscription));
        } else {
            console.log('No subscriptions configured');
        }
    } catch (err) {
        console.error('Error while loading configured subscriptions', err);
    }
};

const addSubscription = function (name, subscriptionId) {
    try {
        if (config && config.subscriptions) {
            const subscription = config.subscriptions.filter(subsc => name in subsc)[0];
            if (subscription) {
                console.log(`Subscription with name '${name}' already configured: ${subscriptionId}`);
            } else {
                config.subscriptions.push({ [name]: subscriptionId });
            }
        } else {
            config = {
                subscriptions: { [name]: subscriptionId }
            };
        }
        writeConfig(config);
    } catch (err) {
        console.error('Error while adding subscription', err);
    }
};

const removeSubscription = function (name) {
    try {
        if (config && config.subscriptions) {
            const subscriptions = config.subscriptions.filter(subsc => !(name in subsc));
            config.subscriptions = subscriptions;

            if (config.activeSubscription && name in config.activeSubscription) {
                config.activeSubscription = null;
            }
        }
        writeConfig(config);
    } catch (err) {
        console.error('Error while removing subscription', err);
    }
};

const setActiveSubscription = function (name) {
    try {
        if (config && config.subscriptions) {
            const subscription = config.subscriptions.filter(subsc => name in subsc)[0];
            console.log(subscription);
            if (subscription) {
                config.activeSubscription = subscription;
                writeConfig(config);
                console.log(`Set '${JSON.stringify(subscription)}' as active subscription`);
            } else {
                console.log(`No subscription configured with '${name}'. Try to add a subscription first`);
            }
        } else {
            console.log('No subscriptions configured. Try to add a subscription first');
        }

    } catch (err) {
        console.error('Error while setting active subscription', err);
    }
};

const activeSubscription = function () {
    try {
        if (config.activeSubscription) {
            console.log(`Current active subscription '${JSON.stringify(config.activeSubscription)}'`);
        } else {
            console.log('No active subscription configured');
        }
    } catch (err) {
        console.error('Error while loading configured subscriptions', err);
    }
};

const _buildOptions = function ({ cluster, resourceGroup, subscription }) {
    const currentClusterContext = _getCurrentCluster();
    return {
        name: cluster ?? currentClusterContext,
        resourceGroup: resourceGroup ?? currentClusterContext,
        subscription: config.activeSubscription ? Object.values(config.activeSubscription)[0] : subscription
    };
};

const _getCurrentIp = function () {
    const result = exec('curl', ['http://ipinfo.io/json']);
    return JSON.parse(result).ip;
};

const _getCurrentCluster = function () {
    const currentContext = exec('kubectl', ['config', 'current-context']);
    return currentContext.trim();
};

module.exports = {
    activeSubscription,
    getCurrentContext,
    addSubscription,
    addIp,
    addCurrentIp,
    showCurrentIp,
    listIpRange,
    listSubscriptions,
    setActiveSubscription,
    removeSubscription
};