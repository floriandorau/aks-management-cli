import { publicIpv4 } from 'public-ip';

import { removeIp } from '../../src/cli.js';

export default {
    command: 'remove-current',
    desc: 'Removes current public ip from AKS authorized ip-ranges if exists',
    handler: () => {
        publicIpv4()
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
    },
};
