const az = require('./azure');
const isIp = require('is-ip');
const publicIp = require('public-ip');

const { exec } = require('./cmd');
const { readConfig, writeConfig } = require('./config');

let config = readConfig();

const addIp = async function (ip, { cluster, resourceGroup, subscription }) {
    try {
        if (!isIp.v4(ip)) {
            console.log(`'${ip}' is not a valid IPv4 address.`);
            return;
        }

        console.log(`Adding ${ip} to authorized ip range`);
        const authorizedIpRanges = await az.addIp(ip, await _buildClusterOptions({ cluster, resourceGroup, subscription }));

        console.log(`Updated authorized ip ranges are: ${authorizedIpRanges}`);
    } catch (err) {
        console.error('Error while adding ip address', err);
    }
};

const removeIp = async function (ip, { cluster, resourceGroup, subscription }) {
    try {
        if (!isIp.v4(ip)) {
            console.log(`'${ip}' is not a valid IPv4 address.`);
            return;
        }

        console.log(`Removing ${ip} from authorized ip range`);
        const authorizedIpRanges = await az.removeIp(ip, await _buildClusterOptions({ cluster, resourceGroup, subscription }));

        console.log(`Updated authorrized ip ranges are: ${authorizedIpRanges}`);
    } catch (err) {
        console.error('Error while removing ip address', err);
    }
};

const addCurrentIp = async function ({ cluster, resourceGroup, subscription }) {
    const currentIp = await publicIp.v4();
    console.log(`Will add your public ip address '${currentIp}' to authorized ip ranges`);
    await addIp(currentIp, { cluster, resourceGroup, subscription });
};

const getCurrentContext = async function () {
    try {
        const clusterContext = await _getCurrentCluster();
        console.log(`Your current cluster context is: '${clusterContext}'`);
    } catch (err) {
        console.error('Error while reading cluster context', err);
    }
};

const showCurrentIp = async function () {
    try {
        const ip = await publicIp.v4();
        console.log(`Current public ip address is: '${ip}'`);
    } catch (err) {
        console.error('Error while gathering your current ip address', err);
    }
};

const listIpRange = async function ({ cluster, resourceGroup, subscription }) {
    const options = await _buildClusterOptions({ cluster, resourceGroup, subscription });

    az.fetchAuthorizedIpRanges(options)
        .then(ipRanges => console.log(`Authorized ip ranges are: ${ipRanges}`))
        .catch(err => console.error('Error while list ip range', err));
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

const _buildClusterOptions = async function ({ cluster, resourceGroup, subscription }) {
    const currentClusterContext = await _getCurrentCluster();
    return {
        name: cluster ?? currentClusterContext,
        resourceGroup: resourceGroup ?? currentClusterContext,
        subscription: config.activeSubscription ? Object.values(config.activeSubscription)[0] : subscription
    };
};

const _getCurrentCluster = async function () {
    const currentContext = await exec('kubectl', ['config', 'current-context']);
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
    removeSubscription,
    removeIp
};