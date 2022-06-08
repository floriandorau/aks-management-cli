import Table from 'cli-table3';

import publicIp from 'public-ip';
import logSymbols from 'log-symbols';

import { isInSubnet } from 'is-in-subnet';

export const printAuthorizedIpRanges = async function (
    authorizedIpRanges,
    context
) {
    const currentIp = await publicIp.v4();

    const table = new Table({
        head: ['#', 'Authorized ip range', 'Matches your ip'],
        colAligns: ['left', 'left', 'center'],
        style: { head: [] },
    });

    authorizedIpRanges.forEach((ipRange, idx) => {
        table.push([
            idx + 1,
            ipRange,
            isInSubnet(currentIp, ipRange) ? logSymbols.success : '',
        ]);
    });

    console.log('\n');
    console.log(`Authorized ip ranges of cluster '${context.name}'`);
    console.log(table.toString());
    console.log('\n');
};

export const printError = function (message, err) {
    console.log(logSymbols.error, message, '\n');
    console.log(err.message);
};
