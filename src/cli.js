const { exec } = require('./cmd');
const az = require('./azure');

const { readConfig, writeConfig } = require('./config');

let config = readConfig();

const addIp = function (ip, { cluster, resourceGroup, subscription }) {
    try {
        console.log(`Adding ${ip} to azure ip whitelist`);
        az.addIp(ip, _buildOptions({ cluster, resourceGroup, subscription }));
    } catch (err) {
        console.error('Error while adding ip address', err)
    }
}

const addCurrentIp = function ({ cluster, resourceGroup, subscription }) {
    try {
        const currentIp = _getCurrentIp();
        az.addIp(currentIp, _buildOptions({ cluster, resourceGroup, subscription }))
    } catch (err) {
        console.error('Error while adding current ip address', err)
    }
}

const getCurrentContext = function () {
    try {
        const clusterContext = _getCurrentCluster();
        console.log(`Your current cluster context is: '${clusterContext}'`);
    } catch (err) {
        console.error('Error while reading cluster context', err)
    }
}

const showCurrentIp = function () {
    try {
        const ip = _getCurrentIp();
        console.log(`Your current ip address is: '${ip}'`);
    } catch (err) {
        console.error('Error while gathering ip address', err)
    }
}

const listIpRange = function ({ cluster, resourceGroup, subscription }) {
    try {
        az.listIpRange(_buildOptions({ cluster, resourceGroup, subscription }))
    } catch (err) {
        console.error('Error while gathering ip address', err)
    }
}

const listSubscriptions = function () {
    try {
        if (config.subscriptions) {
            config.subscriptions.forEach(subscription => console.log(subscription));
        } else {
            console.log('No subscriptions configured')
        }
    } catch (err) {
        console.error('Error while loading configured subscriptions', err)
    }
}

const addSubscription = function (name, subscriptionId) {
    try {
        if (config && config.subscriptions) {
            const subscription = config.subscriptions.filter(subsc => subsc.hasOwnProperty(name));
            if (subscription) {
                console.log(`Subscription with name '${name}' already configured: ${subscriptionId}`);
            } else {
                config.subscriptions.push({ [name]: subscriptionId });
            }
        } else {
            config = {
                subscriptions: { [name]: subscriptionId }
            }
        }
        writeConfig(config);
    } catch (err) {
        console.error('Error while loading addding subscription', err)
    }
}

const setActiveSubscription = function (name) {
    try {
        if (config && config.subscriptions) {
            const subscription = config.subscriptions.filter(subsc => subsc.hasOwnProperty(name))[0];
            console.log(subscription)
            if (subscription) {
                config.activeSubscription = subscription;
                console.log(`Setting subscription '${JSON.stringify(subscription)}' as current active subscription`);
                writeConfig(config);
            } else {
                console.log(`No subscription configured with '${name}'. Try to add a subscription first`);
            }
        } else {
            console.log('No subscriptions configured. Try to add a subscription first');
        }

    } catch (err) {
        console.error('Error while setting active subscription', err)
    }
}

const activeSubscription = function () {
    try {
        if (config.activeSubscription) {
            console.log(`Current active subscription '${JSON.stringify(config.activeSubscription)}'`);
        } else {
            console.log('No active subscription configured')
        }
    } catch (err) {
        console.error('Error while loading configured subscriptions', err)
    }
}

const _buildOptions = function ({ cluster, resourceGroup, subscription }) {
    const currentClusterContext = _getCurrentCluster();
    return {
        name: cluster ?? currentClusterContext,
        resourceGroup: resourceGroup ?? currentClusterContext,
        subscription
    };
}

const _getCurrentIp = function () {
    const result = exec('curl', ['http://ipinfo.io/json'])
    return JSON.parse(result).ip;
}

const _getCurrentCluster = function () {
    const currentContext = exec('kubectl', ['config', 'current-context']);
    return currentContext;
}

module.exports = { activeSubscription, getCurrentContext, addSubscription, addIp, addCurrentIp, showCurrentIp, listIpRange, listSubscriptions, setActiveSubscription }