import publicIp from 'public-ip';

export default {
    command: 'show-current',
    desc: 'Prints your current public ip address',
    builder: () => {},
    handler: () => {
        publicIp
            .v4()
            .then((currentIp) =>
                console.log(`Current public ip address is: '${currentIp}'`)
            )
            .catch((err) =>
                console.error(
                    'Error while gathering your current public ip address',
                    err
                )
            );
    },
};
