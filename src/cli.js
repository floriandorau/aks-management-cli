const az = require('./azure');
const isIp = require('is-ip');

const { exec } = require('./util/cmd');
const { initConfig: createConfig, existsConfig, getConfigPath, readConfig } = require('./util/config');

const printAuthorizedIpRanges = function (authorizedIpRanges) {
    console.log('Authorized ip ranges are:');
    authorizedIpRanges.forEach(ipRange => console.log(`- ${ipRange}`));
};

const initConfig = function () {
    if (existsConfig()) {
        console.log(`Initialize: Config already exists at '${getConfigPath()}`);
    } else {
        console.log(`Initialize: Creating new config at '${getConfigPath()}'`);
        createConfig();
    }
};

const showConfig = function () {
    const config = readConfig();
    console.log(`Your current config is: '${JSON.stringify(config, null, '  ')}'`);
};

const addIp = async function (ip, { cluster, resourceGroup, subscription }) {
    _validateIp(ip);

    console.log(`Adding ${ip} to authorized ip range`);
    az.addIp(ip, await _buildClusterOptions({ cluster, resourceGroup, subscription }))
        .then(ipRanges => printAuthorizedIpRanges(ipRanges))
        .catch(err => console.error('Error while adding ip address', err));
};

const removeIp = async function (ip, { cluster, resourceGroup, subscription }) {
    _validateIp(ip);

    console.log(`Removing ${ip} from authorized ip range`);
    az.removeIp(ip, await _buildClusterOptions({ cluster, resourceGroup, subscription }))
        .then(ipRanges => printAuthorizedIpRanges(ipRanges))
        .catch(err => console.error('Error while removing ip address', err));
};

const getCurrentContext = function () {
    _getCurrentCluster()
        .then(clusterContext => console.log(`Your current cluster context is: '${clusterContext}'`))
        .catch(err => console.error('Error while reading cluster context', err));
};

const listIpRange = async function ({ cluster, resourceGroup, subscription }) {
    const options = await _buildClusterOptions({ cluster, resourceGroup, subscription });
    az.fetchAuthorizedIpRanges(options)
        .then(ipRanges => printAuthorizedIpRanges(ipRanges))
        .catch(err => console.error('Error while list ip range', err));
};

const _buildClusterOptions = async function ({ cluster, resourceGroup, subscription }) {
    const config = readConfig();
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


const _validateIp = function (ip) {
    if (!isIp.v4(ip)) {
        throw new Error(`'${ip}' is not a valid IPv4 address.`);
    }
};

module.exports = { getCurrentContext, addIp, listIpRange, removeIp, initConfig, showConfig };