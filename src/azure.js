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
    let ipRange = listIpRange({ name, resourceGroup, subscription });

    // It's not allowed to add ip range when '0.0.0.0/32' is set.
    ipRange = ipRange.filter(range => range !== '0.0.0.0/32');
    const authorizedIpRanges = new Set([...ipRange, ip]);

    console.log(authorizedIpRanges);
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