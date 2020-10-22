const { exec } = require('./cmd');

const listIpRange = ({ name, resourceGroup, subscription }, options = { debug: true }) => {
    const argsAccount = [
        'aks',
        'show',
        '--name', name,
        '--resource-group', resourceGroup,
        '--subscription', subscription,
    ];

    const result = JSON.parse(exec('az', argsAccount, options));
    return result?.apiServerAccessProfile?.authorizedIpRanges;
};

const addIp = (ip, { name, resourceGroup, subscription }, options = { debug: true }) => {
    console.log(ip);
    const ipRange = listIpRange({ name, resourceGroup, subscription });

    const authorizedIpRanges = new Set([ipRange, ip]);

    const argsAccount = [
        'aks',
        'update',
        '--api-server-authorized-ip-ranges', Array.from(authorizedIpRanges).join(','),
        '--name', name,
        '--resource-group', resourceGroup,
        '--subscription', subscription,
    ];

    const result = JSON.parse(exec('az', argsAccount, options));
    console.log(result);
};

module.exports = { addIp, listIpRange };