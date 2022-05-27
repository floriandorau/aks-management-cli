import isIp from 'is-ip';

export const isIpV4 = (ip) => {
    if (!isIp.v4(ip)) throw Error(`'${ip}' is not a valid IPv4 address.`);
};
