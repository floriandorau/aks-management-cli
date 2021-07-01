const publicIp = require('public-ip');

const { removeIp } = require('../../src/cli');

exports.command = 'rm-current';
exports.desc = 'Removes current public ip from AKS authorized ip-ranges if exists';
exports.builder = () => { };
exports.handler = async (argv) => {
    const currentIp = await publicIp.v4();
    console.log(`Will remove your public ip address '${currentIp}' from authorized ip ranges`);
    const { cluster, resourceGroup, subscription } = argv;
    removeIp(currentIp, { cluster, resourceGroup, subscription });
};