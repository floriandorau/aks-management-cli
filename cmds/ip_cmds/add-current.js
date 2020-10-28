const publicIp = require('public-ip');

const { addIp } = require('../../src/cli');

exports.command = 'add-current';
exports.desc = 'Adds your current public ip to AKS authorized ip-ranges';
exports.builder = () => { };
exports.handler = async (argv) => {
    const currentIp = await publicIp.v4();
    console.log(`Will add your public ip address '${currentIp}' to authorized ip ranges`);

    const { cluster, resourceGroup, subscription } = argv;
    addIp(currentIp, { cluster, resourceGroup, subscription });
};
