const ora = require('ora');
const isIp = require('is-ip');
const publicIp = require('public-ip');

const az = require('./azure');
const { exec } = require('./util/cmd');
const { initConfig: createConfig, existsConfig, getConfigPath, readConfig } = require('./util/config');

const printAuthorizedIpRanges = async function (authorizedIpRanges, options) {
    const currentIp = await publicIp.v4();
    console.log(`Authorized ip ranges of cluster '${options.name}' are:`);
    authorizedIpRanges.forEach(ipRange => console.log(`-> ${ipRange} ${ipRange.includes(currentIp) ? '[Your current IP]' : ''}`));
};

const initConfig = function () {
    if (existsConfig()) {
        return console.log(`Initialize: Config already exists at '${getConfigPath()}`);
    }

    console.log(`Initialize: Creating new config at '${getConfigPath()}'`);
    createConfig();
};

const showConfig = function () {
    if (!existsConfig()) {
        return console.log('Config does not exist yet. Please run \'init\' to create intial configuration.');
    }

    const config = readConfig();
    console.log(`Your current config is: '${JSON.stringify(config, null, '  ')}'`);
};

const addIp = async function (ip, { cluster, resourceGroup, subscription }) {
    _validateIp(ip);

    console.log(`Adding ${ip} to authorized ip range`);
    const options = await _buildClusterOptions({ cluster, resourceGroup, subscription });
    az.addIp(ip, options)
        .then(ipRanges => printAuthorizedIpRanges(ipRanges, options))
        .catch(err => console.error('Error while adding ip address', err));
};

const removeIp = async function (ip, { cluster, resourceGroup, subscription }) {
    _validateIp(ip);

    const spinner = ora(`Removing ${ip} from authorized ip ranges`).start();

    const options = await _buildClusterOptions({ cluster, resourceGroup, subscription });
    az.removeIp(ip, options)
        .then(ipRanges => {
            spinner.stop();
            printAuthorizedIpRanges(ipRanges, options);
        })
        .catch(err => console.error('Error while removing ip address', err));
};

const getCurrentContext = function () {
    _getCurrentCluster()
        .then(clusterContext => console.log(`Your current cluster context is: '${clusterContext}'`))
        .catch(err => console.error('Error while reading cluster context', err));
};

const listIpRange = async function ({ cluster, resourceGroup, subscription }) {
    const options = await _buildClusterOptions({ cluster, resourceGroup, subscription });
    const spinner = ora('Listing authorized ip ranges').start();
    az.fetchAuthorizedIpRanges(options)
        .then(ipRanges => {
            spinner.stop();
            printAuthorizedIpRanges(ipRanges, options);
        })
        .catch(err => {
            spinner.stop();
            console.error('Error while listing ip ranges', err);
        });
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