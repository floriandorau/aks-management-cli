import { isIPv4 } from 'is-ip';

export const isIpV4 = (ip) => {
    if (!isIPv4(ip)) throw Error(`'${ip}' is not a valid IPv4 address.`);
};
