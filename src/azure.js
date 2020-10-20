const { exec } = require('./cmd');

const listIpRange = ({ name, resourceGroup, subscription }, options = { debug: true }) => {
    const argsAccount = [
        'aks',
        'show',
        '--name', name,
        '--resource-group', resourceGroup,
        '--subscription', subscription,
    ];

    return JSON.parse(utils.cmd('az', argsAccount, options));
};

const addIp = (ip, { name, resourceGroup, subscription }, options = { debug: true }) => {
    const argsAccount = [
        'aks',
        'update',
        '--api-server-authorized-ip-ranges', ip,
        '--name', name,
        '--resource-group', resourceGroup,
        '--subscription', subscription,
    ];

    return JSON.parse(utils.cmd('az', argsAccount, options));
};

module.exports = { addIp, listIpRange };