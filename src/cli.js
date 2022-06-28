import * as az from './azure.js';

import { isIpV4 } from './validate.js';
import { printAuthorizedIpRanges, printError } from './output.js';
import { saveAuthorizedIp, removeAuthorizedIp } from './context.js';
import { buildClusterContext, getCurrentContext } from './kubectl.js';
import {
    initConfig as createConfig,
    existsConfig,
    getConfigPath,
    readConfig,
} from './util/config.js';

export const initConfig = function () {
    const configPath = getConfigPath();
    if (existsConfig(configPath)) {
        return console.log(
            `Initialize: Config already exists at '${configPath}`
        );
    }

    console.log(`Initialize: Creating new config at '${configPath}'`);
    createConfig();
};

export const showConfig = function () {
    if (!existsConfig(getConfigPath())) {
        return console.log(
            'Config does not exist yet. Please run "init" to create intial configuration.'
        );
    }

    const config = readConfig();
    console.log(
        `Your current config is: '${JSON.stringify(config, null, '  ')}'`
    );
};

export const addIp = async function (ip) {
    isIpV4(ip);

    console.log(`Adding '${ip}' to AKS authorized ip-ranges`);

    const context = await buildClusterContext();
    az.addIp(ip, context)
        .then((ipRanges) => printAuthorizedIpRanges(ipRanges, context))
        .then(() => saveAuthorizedIp(ip, context))
        .catch((err) =>
            printError(
                `Error while adding ip ${ip} to authorized ip-ranges`,
                err
            )
        );
};

export const removeIp = async function (ip) {
    isIpV4(ip);

    console.log(`Removing ${ip} from AKS authorized ip-ranges`);

    const context = await buildClusterContext();
    az.removeIp(ip, context)
        .then((ipRanges) => printAuthorizedIpRanges(ipRanges, context))
        .then(() => removeAuthorizedIp(ip, context))
        .catch((err) =>
            printError(
                `Error while removing ip ${ip} from authorized ip-ranges`,
                err
            )
        );
};

export const listIpRange = async function () {
    const context = await buildClusterContext();
    az.fetchAuthorizedIpRanges(context)
        .then((ipRanges) => printAuthorizedIpRanges(ipRanges, context))
        .catch((err) =>
            printError('Error while listing authorized ip-ranges', err)
        );
};

export const clearIpRange = async function () {
    console.log('Clearing existing AKS authorized ip-ranges');

    const context = await buildClusterContext();
    az.clearAuthorizedIpRanges(context)
        .then(() => console.log('Authorized ip-ranges cleared'))
        .catch((err) =>
            printError('Error while clearing authorized ip-ranges', err)
        );
};

export const getCredentials = async function () {
    const context = await buildClusterContext();
    az.getCredentials(context).catch((err) =>
        printError(
            `Error while getting credentials for cluster ${context.name}`,
            err
        )
    );
};

export const showCurrentContext = function () {
    getCurrentContext()
        .then((clusterContext) =>
            console.log(
                `Your current kubectl config context is: '${clusterContext}'`
            )
        )
        .catch((err) => printError('Error while reading cluster context', err));
};
