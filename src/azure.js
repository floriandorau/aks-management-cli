const ora = require('ora');

const { exec } = require('./util/cmd');

const DEFAULT_AUTHORIZED_IP_RANGE = '0.0.0.0/32';

const toCidrNotation = (ip) => `${ip}/32`;

const assertContext = (name, resourceGroup, subscription) => {
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

const getCredentials = async ({ name, resourceGroup, subscription }) => {
    assertContext(name, resourceGroup, subscription);
    return _runAz(`Get credentials for cluster ${resourceGroup}/${name}`, [
        'aks',
        'get-credentials',
        '--name', name,
        '--resource-group', resourceGroup,
        '--subscription', subscription,
        '--overwrite-existing'
    ], { parseResponse: false });
};

const fetchAuthorizedIpRanges = async ({ name, resourceGroup, subscription }) => {
    assertContext(name, resourceGroup, subscription);
    return _runAz(`Fetching authorized ip-ranges from ${resourceGroup}/${name}`, [
        'aks',
        'show',
        '--name', name,
        '--resource-group', resourceGroup,
        '--subscription', subscription,
    ]);
};

const addIp = async (ip, context) => {
    let authorizedIpRanges = await fetchAuthorizedIpRanges(context);

    const ipCidr =  toCidrNotation(ip);
    
    if (authorizedIpRanges.includes(ipCidr)) {
        console.log(`Ip '${ip}' is already added to authorized ip-ranges`);
        return authorizedIpRanges;
    }

    // It's not allowed to add ip range when '0.0.0.0/32' is set.
    authorizedIpRanges = authorizedIpRanges
        .filter(range => range !== DEFAULT_AUTHORIZED_IP_RANGE);
        
    if(context.authorizedIp) {
        console.log(`Removing previously authorized ip '${context.authorizedIp}' from authorized ip-ranges`);
        const previousAuthorizedIpCidr = toCidrNotation(context.authorizedIp);
        authorizedIpRanges = authorizedIpRanges.filter(range => range !== previousAuthorizedIpCidr);
    }

    let newAuthorizedIpRanges = new Set([...authorizedIpRanges, ipCidr]);
    return _updateAuthorizedIpRanges(newAuthorizedIpRanges, context);
};

const removeIp = async (ip, context) => {
    let remoteAuthorizedIpRanges = await fetchAuthorizedIpRanges(context);

    const ipCidr =  toCidrNotation(ip);

    const authorizedIpRanges = remoteAuthorizedIpRanges.filter(range => range !== ipCidr);
    if (authorizedIpRanges.length === 0) {
        authorizedIpRanges.push(DEFAULT_AUTHORIZED_IP_RANGE);
        console.log(`No authorized ip-range left. Will set default authorized ip-range for security reasons [${DEFAULT_AUTHORIZED_IP_RANGE}] `);
    }

    return _updateAuthorizedIpRanges(authorizedIpRanges, context);
};

const _updateAuthorizedIpRanges = async (authorizedIpRanges, { name, resourceGroup, subscription }) => {
    assertContext(name, resourceGroup, subscription);

    const ipRanges = Array.from(authorizedIpRanges).join(', ');
    return _runAz(`Updating authorized ip-ranges to [${ipRanges}]`, [
        'aks',
        'update',
        '--api-server-authorized-ip-ranges', ipRanges,
        '--name', name,
        '--resource-group', resourceGroup,
        '--subscription', subscription,
    ]);
};

const _parseResponse = (response) => {
    const result = JSON.parse(response);
    return result?.apiServerAccessProfile?.authorizedIpRanges || [];
};

const _runAz = async (message, args, options = { parseResponse: true, debug: false }) => {
    const spinner = ora(message).start();

    try {
        const response = await exec('az', args, options);
        if (!response) {
            spinner.fail();
            throw Error('no valid response from cluster');
        }
        spinner.succeed();

        return options.parseResponse ? _parseResponse(response) : response;
    } catch (e) {
        spinner.fail();
        throw e;
    }
};

module.exports = { getCredentials, addIp, removeIp, fetchAuthorizedIpRanges };