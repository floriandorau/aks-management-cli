const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const logger = require('./logger');

const notNull = (obj, msg) => {
    if (!obj) {
        throw new Error(msg);
    }
};

const workingDir = (name) => {
    notNull(name, 'workingDir name must be defined');

    if (!fs.existsSync('workdir')) {
        fs.mkdirSync('workdir');
    }

    const workdirPath = path.join('workdir', name);
    if (fs.existsSync(workdirPath)) {
        fs.unlinkSync(workdirPath);
    }

    logger.debug(`Creating workspace directory at '${workdirPath}'...`);
    fs.mkdirSync(workdirPath);

    return workdirPath;
};

const readJsonFile = (path) => {
    notNull(path, 'jsonFile path must be defined');

    if (!fs.existsSync(path)) {
        throw new Error(path + ' does not exist');
    }
    const jsonFile = fs.readFileSync(path, { encoding: 'UTF-8' });
    return JSON.parse(jsonFile);
};

const commandString = function (cmd, args) {
    const str = [cmd];
    for (let arg of args) {
        if (arg.startsWith('-')) {
            break;
        } else {
            str.push(arg);
        }
    }
    return str.join(' ');
};

const cmd = (cmd, args, opts = {}) => {
    const log = opts.hasOwnProperty('log') ? opts.log : true;
    const fail = opts.hasOwnProperty('fail') ? opts.fail : true;
    const retries = opts.retries || 0;
    const interval = opts.interval || 5;
    const stderr = opts.stderr;
    const quiet = opts.quiet;
    const debug = opts.debug;

    for (let retry = 0; retry <= retries; retry++) {
        if (log) {
            if (retry > 0) {
                logger.info('Retrying command...'.gray);
            } else {
                if (debug) {
                    logger.info(` -> ${cmd} ${args.join(' ')}`.gray);
                } else {
                    logger.info(` -> ${commandString(cmd, args)}...`.gray);
                }
            }
        }
        try {
            if (quiet) {
                const result = child_process.spawnSync(cmd, args, { 'stdio': 'ignore' });
                if (result.status === 0) {
                    return true;
                } else {
                    throw new Error(`Command failed: ${commandString(cmd, args)}`);
                }
            } else if (stderr) {
                const result = child_process.spawnSync(cmd, args);
                if (result.status === 0) {
                    return result.stderr.toString('utf8');
                } else {
                    logger.error('stderr:', result.stderr.toString('utf8'));
                    logger.error('stdout:', result.stdout.toString('utf8'));
                    throw new Error('Command failed!');
                }
            } else {
                const result = child_process.execFileSync(cmd, args);
                return (result ? result.toString('utf8').trim() : '');
            }
        } catch (e) {
            if (retry < retries) {
                sleep(interval);
            } else {
                if (fail) {
                    throw e;
                } else {
                    return false;
                }
            }
        }
    }
};

const sleep = (seconds) => {
    const s = cmd('sleep', [seconds], { 'quiet': true, 'log': false, 'fail': false });
    if (!s) {
        logger.info('Command "sleep" failed!');
    }
};

module.exports = {
    cmd,
    notNull,
    readJsonFile,
    workingDir
};