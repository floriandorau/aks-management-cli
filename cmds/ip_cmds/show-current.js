const publicIp = require('public-ip');

exports.command = 'show-current';
exports.desc = 'Prints your current public ip address';
exports.builder = () => { };
exports.handler = () => {
    publicIp.v4()
        .then(ip => console.log(`Current public ip address is: '${ip}'`))
        .catch(err => console.error('Error while gathering your current ip address', err));
};