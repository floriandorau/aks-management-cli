const { exec } = require('./cmd');

const DEFAULT_AUTHORIZED_IP_RANGE = '0.0.0.0/32';

const fetchAuthorizedIpRanges = async ({ name, resourceGroup, subscription }) => {
    return _runAz([
        'aks',
        'show',
        '--name', name,
        '--resource-group', resourceGroup,
        '--subscription', subscription,
    ]);
};

const addIp = async (ip, options) => {
    let authorizedIpRanges = await fetchAuthorizedIpRanges(options);

    // Transform ip to CIDR notation
    const ipCidr = `${ip}/32`;

    if (authorizedIpRanges.includes(ipCidr)) {
        console.log(`${ip} is already set as authorized ip ranges`);
        return authorizedIpRanges;
    }

    // It's not allowed to add ip range when '0.0.0.0/32' is set.
    authorizedIpRanges = authorizedIpRanges.filter(range => range !== DEFAULT_AUTHORIZED_IP_RANGE);
    const newAuthorizedIpRanges = new Set([...authorizedIpRanges, ipCidr]);

    return _updateAuthorizedIpRanges(newAuthorizedIpRanges, options);
};

const removeIp = async (ip, options) => {
    let remoteAuthorizedIpRanges = await fetchAuthorizedIpRanges(options);

    const authorizedIpRanges = remoteAuthorizedIpRanges.filter(range => range !== `${ip}/32`);
    if (authorizedIpRanges.length === 0) {
        authorizedIpRanges.push(DEFAULT_AUTHORIZED_IP_RANGE);
        console.log(`No authorized ip-range left. Added deafult ip-range [${DEFAULT_AUTHORIZED_IP_RANGE}] for security reasons`);
    }

    return _updateAuthorizedIpRanges(authorizedIpRanges, options);
};

const _updateAuthorizedIpRanges = async (authorizedIpRanges, { name, resourceGroup, subscription }) => {
    console.log(`Updating authorized ip-range to ${authorizedIpRanges}`);
    return _runAz([
        'aks',
        'update',
        '--api-server-authorized-ip-ranges', Array.from(authorizedIpRanges).join(','),
        '--name', name,
        '--resource-group', resourceGroup,
        '--subscription', subscription,
    ]);
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