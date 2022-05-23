const az = require('./azure');

const { isIpV4 } = require('./validate');
const { saveAuthorizedIp, removeAuthorizedIp } = require('./context');
const { printAuthorizedIpRanges, printError } = require('./output');
const { buildClusterContext, getCurrentContext } = require('./kubectl');
const {
    initConfig: createConfig,
    existsConfig,
    getConfigPath,
    readConfig,
} = require('./util/config');

const initConfig = function () {
    const configPath = getConfigPath();
    if (existsConfig(configPath)) {
        return console.log(
            `Initialize: Config already exists at '${configPath}`
        );
    }

    console.log(`Initialize: Creating new config at '${configPath}'`);
    createConfig();
};

const showConfig = function () {
    if (!existsConfig(getConfigPath())) {
        return console.log(
            "Config does not exist yet. Please run 'init' to create intial configuration."
        );
    }

    const config = readConfig();
    console.log(
        `Your current config is: '${JSON.stringify(config, null, '  ')}'`
    );
};

const addIp = async function (ip) {
    isIpV4(ip);

    console.log(`Adding '${ip}' to AKS authorized ip range`);
    const context = await buildClusterContext();
    az.addIp(ip, context)
        .then((ipRanges) => printAuthorizedIpRanges(ipRanges, context))
        .then(() => saveAuthorizedIp(ip, context))
        .catch((err) => printError(`Error while adding ip ${ip}`, err));
};

const removeIp = async function (ip) {
    isIpV4(ip);

    console.log(`Removing ${ip} from authorized ip ranges`);

    const context = await buildClusterContext();
    az.removeIp(ip, context)
        .then((ipRanges) => printAuthorizedIpRanges(ipRanges, context))
        .then(() => removeAuthorizedIp(ip, context))
        .catch((err) => printError('Error while removing ip address', err));
};

const listIpRange = async function () {
    const context = await buildClusterContext();
    az.fetchAuthorizedIpRanges(context)
        .then((ipRanges) => printAuthorizedIpRanges(ipRanges, context))
        .catch((err) => printError('Error while listing ip ranges', err));
};

const getCredentials = async function () {
    const context = await buildClusterContext();
    az.getCredentials(context).catch((err) =>
        printError(
            `Error while getting credentials for cluster ${context.name}`,
            err
        )
    );
};

const showCurrentContext = function () {
    getCurrentContext()
        .then((clusterContext) =>
            console.log(
                `Your current kubectl config context is: '${clusterContext}'`
            )
        )
        .catch((err) => printError('Error while reading cluster context', err));
};

module.exports = {
    addIp,
    getCredentials,
    initConfig,
    listIpRange,
    removeIp,
    showConfig,
    showCurrentContext,
};
