import { publicIpv4 } from 'public-ip';

import { addIp } from '../../src/cli.js';

export default {
    command: 'add-current',
    desc: 'Adds your current public ip to AKS authorized ip-ranges',
    handler: () => {
        publicIpv4()
            .then((currentIp) => {
                console.log(
                    `Your public ip address '${currentIp}' will be added to authorized ip ranges`
                );
                addIp(currentIp);
            })
            .catch((err) =>
                console.error(
                    'Error while gathering your current public ip address',
                    err
                )
            );
    },
};
