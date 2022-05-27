#!/usr/bin/env node
import ora from 'ora';
import termSize from 'term-size';
import isOnline from 'is-online';
import logSymbols from 'log-symbols';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { commands } from '../cmds/index.js';

const handleError = function (msg, err) {
    if (err) {
        console.log('\n');
        console.log('Error running command');
        console.error(logSymbols.error, err.message);
        console.log('\n');
    } else if (msg) {
        console.log(msg);
    }

    process.exit(1);
};

const checkInternetConnection = () =>
    isOnline().then((online) =>
        online ? Promise.resolve() : Promise.reject()
    );

(() => {
    const spinner = ora('Checking internet connection').start();
    checkInternetConnection()
        .then(() => {
            spinner.succeed('Connected');
            yargs(hideBin(process.argv))
                .command(commands)
                .demandCommand()
                .version()
                .completion()
                .wrap(termSize().columns)
                .help('help')
                .fail(handleError)
                .epilogue(
                    'for more information, see https://github.com/floriandorau/aks-management-cli'
                ).argv;
        })
        .catch(() => {
            spinner.fail(
                'No internet connection. Please try again with intenet connected.'
            );
            process.exit(1);
        });
})();
