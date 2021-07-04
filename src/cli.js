const ora = require('ora');
const isIp = require('is-ip');
const publicIp = require('public-ip');

const az = require('./azure');
const { exec } = require('./util/cmd');
const { initConfig: createConfig, existsConfig, getConfigPath, readConfig } = require('./util/config');

const printAuthorizedIpRanges = async function (authorizedIpRanges, context) {
    const currentIp = await publicIp.v4();
    console.log(`Authorized ip ranges of cluster '${context.name}' are:`);
    authorizedIpRanges.forEach(ipRange => console.log(`-> ${ipRange} ${ipRange.includes(currentIp) ? '[Your current IP]' : ''}`));
};

const handleError = function (message, err) {
    console.log(message, '\n');
    console.log(err.message);
};

const initConfig = function () {
    const configPath = getConfigPath();
    if (existsConfig(configPath)) {
        return console.log(`Initialize: Config already exists at '${configPath}`);
    }

    console.log(`Initialize: Creating new config at '${configPath}'`);
    createConfig();
};

const showConfig = function () {
    if (!existsConfig(getConfigPath())) {
        return console.log('Config does not exist yet. Please run \'init\' to create intial configuration.');
    }

    const config = readConfig();
    console.log(`Your current config is: '${JSON.stringify(config, null, '  ')}'`);
};

const addIp = async function (ip) {
    _validateIp(ip);

    console.log(`Adding '${ip}' to AKS authorized ip range`);
    const context = await _buildClusterContext();
    az.addIp(ip, context)
        .then(ipRanges => printAuthorizedIpRanges(ipRanges, context))
        .catch(err => console.error('Error while adding ip address', err));
};

const removeIp = async function (ip) {
    _validateIp(ip);

    const spinner = ora(`Removing ${ip} from authorized ip ranges`).start();

    const context = await _buildClusterContext();
    az.removeIp(ip, context)
        .then(ipRanges => {
            spinner.stop();
            printAuthorizedIpRanges(ipRanges, context);
        })
        .catch(err => console.error('Error while removing ip address', err));
};

const getCurrentContext = function () {
    _getCurrentContext()
        .then(clusterContext => console.log(`Your current cluster context is: '${clusterContext}'`))
        .catch(err => console.error('Error while reading cluster context', err));
};

const listIpRange = async function () {
    const context = await _buildClusterContext();
    az.fetchAuthorizedIpRanges(context)
        .then(ipRanges => printAuthorizedIpRanges(ipRanges, context))
        .catch(err => handleError('Error while listing ip ranges', err));
};

const _buildClusterContext = async function () {
    const config = readConfig();
    const currentContext = await _getCurrentContext();

    if (config && config.contexts) {
        const context = config.contexts.filter(context => currentContext in context)[0];
        return {
            name: context[currentContext].name,
            resourceGroup: context[currentContext].resourceGroup,
            subscription: context[currentContext].subscriptionId
        };
    } else {
        throw Error(`No context configured with name '${currentContext}'. Try to add context first.`);
    }

};

const _getCurrentContext = async function () {
    const currentContext = await exec('kubectl', ['config', 'current-context']);
    return currentContext.trim();
};


const _validateIp = function (ip) {
    if (!isIp.v4(ip)) {
        throw new Error(`'${ip}' is not a valid IPv4 address.`);
    }
};

module.exports = { getCurrentContext, addIp, listIpRange, removeIp, initConfig, showConfig };