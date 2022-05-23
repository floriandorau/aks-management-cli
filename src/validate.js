const isIp = require('is-ip');

const isIpV4 = function (ip) {
    if (!isIp.v4(ip)) throw Error(`'${ip}' is not a valid IPv4 address.`);
};

module.exports = { isIpV4 };
