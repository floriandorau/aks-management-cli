const ora = require('ora');

const { exec } = require('./util/cmd');

const DEFAULT_AUTHORIZED_IP_RANGE = '0.0.0.0/32';

const assertOptions = function ({ name, resourceGroup, subscription }) {
    if (!name) {
        throw Error('No name provided. Use option --cluster');
    }
    if (!resourceGroup) {
        throw Error('No resourceGroup provided. Use option --resource-group');
    }
    if (!subscription) {
        throw Error('No subscription provided. Either use option --subscription or try to set active subscription');
    }
};

const fetchAuthorizedIpRanges = async (options) => {
    assertOptions(options);

    const spinner = ora(`Fetching authorized ip-ranges from ${options.name}`).start();
    const response = await _runAz([
        'aks',
        'show',
        '--name', options.name,
        '--resource-group', options.resourceGroup,
        '--subscription', options.subscription,
    ]);
    spinner.stop();
    return response;
};

const addIp = async (ip, options) => {
    assertOptions(options);

    let authorizedIpRanges = await fetchAuthorizedIpRanges(options);

    // Transform ip to CIDR notation
    const ipCidr = `${ip}/32`;

    if (authorizedIpRanges.includes(ipCidr)) {
        console.log(`Ip ${ip} is already set as authorized ip ranges`);
        return authorizedIpRanges;
    }

    // It's not allowed to add ip range when '0.0.0.0/32' is set.
    authorizedIpRanges = authorizedIpRanges.filter(range => range !== DEFAULT_AUTHORIZED_IP_RANGE);
    const newAuthorizedIpRanges = new Set([...authorizedIpRanges, ipCidr]);

    return _updateAuthorizedIpRanges(newAuthorizedIpRanges, options);
};

const removeIp = async (ip, options) => {
    assertOptions(options);

    let remoteAuthorizedIpRanges = await fetchAuthorizedIpRanges(options);

    const authorizedIpRanges = remoteAuthorizedIpRanges.filter(range => range !== `${ip}/32`);
    if (authorizedIpRanges.length === 0) {
        authorizedIpRanges.push(DEFAULT_AUTHORIZED_IP_RANGE);
        console.log(`No authorized ip-range left. Will set default authorized ip-range for security reasons [${DEFAULT_AUTHORIZED_IP_RANGE}] `);
    }

    return _updateAuthorizedIpRanges(authorizedIpRanges, options);
};

const _updateAuthorizedIpRanges = async (authorizedIpRanges, options) => {
    assertOptions(options);

    const ipRanges = Array.from(authorizedIpRanges).join(',');
    //console.log(`Updating authorized ip-ranges to ${ipRanges}`);
    const spinner = ora(`Updating authorized ip-ranges to ${ipRanges}`).start();
    const response = await _runAz([
        'aks',
        'update',
        '--api-server-authorized-ip-ranges', ipRanges,
        '--name', options.name,
        '--resource-group', options.resourceGroup,
        '--subscription', options.subscription,
    ]);
    spinner.stop();
    return response;
};

const _parseResponse = (response) => {
    const result = JSON.parse(response);
    return result?.apiServerAccessProfile?.authorizedIpRanges || [];
};

const _runAz = async (args, options = { debug: false }) => {
    const response = await exec('az', args, options);
    if (!response) {
        throw new Error('no valid response from cluster');
    }

    return _parseResponse(response);
};

module.exports = { addIp, removeIp, fetchAuthorizedIpRanges };