const ora = require('ora');

const { exec } = require('./util/cmd');

const DEFAULT_AUTHORIZED_IP_RANGE = '0.0.0.0/32';

const assertContext = function (name, resourceGroup, subscription) {
    if (!name) {
        throw Error('No cluster name given. Check \'kubectl config current-context\'');
    }
    if (!resourceGroup) {
        throw Error('No resourceGroup given.  Check \'kubectl config current-context\'');
    }
    if (!subscription) {
        throw Error('No subscription given. Use option --subscription or try to set active subscription');
    }
};

const fetchAuthorizedIpRanges = async ({ name, resourceGroup, subscription }) => {
    assertContext(name, resourceGroup, subscription);

    const spinner = ora(`Fetching authorized ip-ranges from ${resourceGroup}/${name}`).start();
    const response = await _runAz([
        'aks',
        'show',
        '--name', name,
        '--resource-group', resourceGroup,
        '--subscription', subscription,
    ]);
    spinner.succeed();
    return response;
};

const addIp = async (ip, context) => {
    let authorizedIpRanges = await fetchAuthorizedIpRanges(context);

    // Transform ip to CIDR notation
    const ipCidr = `${ip}/32`;

    if (authorizedIpRanges.includes(ipCidr)) {
        console.log(`IP '${ip}' is already add to authorized ip ranges`);
        return authorizedIpRanges;
    }

    // It's not allowed to add ip range when '0.0.0.0/32' is set.
    authorizedIpRanges = authorizedIpRanges.filter(range => range !== DEFAULT_AUTHORIZED_IP_RANGE);
    const newAuthorizedIpRanges = new Set([...authorizedIpRanges, ipCidr]);

    return _updateAuthorizedIpRanges(newAuthorizedIpRanges, context);
};

const removeIp = async (ip, context) => {
    let remoteAuthorizedIpRanges = await fetchAuthorizedIpRanges(context);

    const authorizedIpRanges = remoteAuthorizedIpRanges.filter(range => range !== `${ip}/32`);
    if (authorizedIpRanges.length === 0) {
        authorizedIpRanges.push(DEFAULT_AUTHORIZED_IP_RANGE);
        console.log(`No authorized ip-range left. Will set default authorized ip-range for security reasons [${DEFAULT_AUTHORIZED_IP_RANGE}] `);
    }

    return _updateAuthorizedIpRanges(authorizedIpRanges, context);
};

const _updateAuthorizedIpRanges = async (authorizedIpRanges, { name, resourceGroup, subscription }) => {
    assertContext(name, resourceGroup, subscription);

    const ipRanges = Array.from(authorizedIpRanges).join(', ');
    const spinner = ora(`Updating authorized ip-ranges to [${ipRanges}]`).start();
    const response = await _runAz([
        'aks',
        'update',
        '--api-server-authorized-ip-ranges', ipRanges,
        '--name', name,
        '--resource-group', resourceGroup,
        '--subscription', subscription,
    ]);
    spinner.succeed();
    return response;
};

const _parseResponse = (response) => {
    const result = JSON.parse(response);
    return result?.apiServerAccessProfile?.authorizedIpRanges || [];
};

const _runAz = async (args, options = { debug: false }) => {
    const response = await exec('az', args, options);
    if (!response) {
        console.log(response);
        throw new Error('no valid response from cluster');
    }

    return _parseResponse(response);
};

module.exports = { addIp, removeIp, fetchAuthorizedIpRanges };