const Table = require('cli-table3');

const publicIp = require('public-ip');
const logSymbols = require('log-symbols');

const { isInSubnet } = require('is-in-subnet');

const printAuthorizedIpRanges = async function (authorizedIpRanges, context) {
    const currentIp = await publicIp.v4();

    const table = new Table({
        head: ['#', 'Authorized ip range', 'Matches your ip'],
        colAligns: ['left', 'left', 'center'],
        style: { head: [] }
    });

    authorizedIpRanges.forEach((ipRange, idx) => {
        table.push([idx + 1, ipRange, isInSubnet(currentIp, ipRange) ? logSymbols.success : '']);
    });

    console.log('\n');
    console.log(`Authorized ip ranges of cluster '${context.name}'`);
    console.log(table.toString());
    console.log('\n');
};

const printError = function (message, err) {
    console.log(logSymbols.error, message, '\n');
    console.log(err.message);
};

module.exports = { printAuthorizedIpRanges, printError };