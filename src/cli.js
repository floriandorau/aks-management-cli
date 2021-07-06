const ora = require('ora');
const isIp = require('is-ip');
const publicIp = require('public-ip');

const az = require('./azure');
const { buildClusterContext, getCurrentContext } = require('./kubectl');

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
    const context = await buildClusterContext();
    az.addIp(ip, context)
        .then(ipRanges => printAuthorizedIpRanges(ipRanges, context))
        .catch(err => handleError(`Error while adding ip ${ip}`, err));
};

const removeIp = async function (ip) {
    _validateIp(ip);

    const spinner = ora(`Removing ${ip} from authorized ip ranges`).start();

    const context = await buildClusterContext();
    az.removeIp(ip, context)
        .then(ipRanges => {
            spinner.stop();
            printAuthorizedIpRanges(ipRanges, context);
        })
        .catch(err => handleError('Error while removing ip address', err));
};

const listIpRange = async function () {
    const context = await buildClusterContext();
    az.fetchAuthorizedIpRanges(context)
        .then(ipRanges => printAuthorizedIpRanges(ipRanges, context))
        .catch(err => handleError('Error while listing ip ranges', err));
};

const showCurrentContext = function () {
    getCurrentContext()
        .then(clusterContext => console.log(`Your current kubectl config context is: '${clusterContext}'`))
        .catch(err => handleError('Error while reading cluster context', err));
};

const _validateIp = function (ip) {
    if (!isIp.v4(ip)) {
        throw new Error(`'${ip}' is not a valid IPv4 address.`);
    }
};

module.exports = { addIp, listIpRange, removeIp, initConfig, showConfig, showCurrentContext };