const publicIp = require('public-ip');

const { addIp } = require('../../src/cli');

exports.command = 'add-current';
exports.desc = 'Adds your current public ip to AKS authorized ip-ranges';
exports.builder = () => { };
exports.handler = () => {
    publicIp.v4()
        .then(currentIp => {
            console.log(`Your public ip address '${currentIp}' will be added to authorized ip ranges`);
            addIp(currentIp);
        })
        .catch(err => console.error('Error while gathering your current public ip address', err));
};
