import YAML from 'yaml';

import { join } from 'path';
import { homedir } from 'os';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

const CONFIG_VERSION = 1;
const APP_DIR = '.aks-mgmt';
const CONFIG_FILE_NAME = 'config.yml';
const APP_PATH = join(homedir(), APP_DIR);

const _readConfigFile = function (path) {
    const file = readFileSync(path, 'utf8');
    return YAML.parse(file);
};

const _writeConfigFile = function (path, config) {
    const existingConfig = _readConfigFile(path);
    const configString = YAML.stringify(Object.assign(existingConfig, config));
    writeFileSync(path, configString, { encoding: 'utf8' });
};

export const getConfigPath = function () {
    return join(APP_PATH, CONFIG_FILE_NAME);
};

export const existsConfig = function (configPath) {
    return existsSync(configPath);
};

export const initConfig = function () {
    if (!existsSync(APP_PATH)) mkdirSync(APP_PATH);

    const configPath = getConfigPath();
    const configString = YAML.stringify({ version: CONFIG_VERSION });
    writeFileSync(configPath, configString, { encoding: 'utf8' });
};

export const readConfig = function () {
    const configPath = getConfigPath();
    if (!existsConfig(configPath)) {
        throw new Error(
            `No config.yml found. Please make sure that you have a valid config at ${configPath}.`
        );
    }
    return _readConfigFile(configPath);
};

export const writeConfig = function (config) {
    const configPath = getConfigPath();
    if (!existsConfig(configPath)) {
        throw new Error(
            `No config.yml found. Please make sure that you have a valid config at ${configPath}`
        );
    }
    _writeConfigFile(configPath, config);
};

export const get = (prop) => {
    const config = readConfig();
    return config ? config[prop] : null;
};
