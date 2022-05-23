const publicIp = require('public-ip');

const { removeIp } = require('../../src/cli');

exports.command = 'remove-current';
exports.desc =
    'Removes current public ip from AKS authorized ip-ranges if exists';
exports.builder = () => {};
exports.handler = () => {
    publicIp
        .v4()
        .then((currentIp) => {
            console.log(
                `Will remove your public ip address '${currentIp}' from authorized ip ranges`
            );
            removeIp(currentIp);
        })
        .catch((err) =>
            console.error(
                'Error while gathering your current public ip address',
                err
            )
        );
};
