const YAML = require('yaml');

const { join } = require('path');
const { homedir } = require('os');
const { existsSync, readFileSync, writeFileSync, mkdirSync } = require('fs');

const CONFIG_VERSION = 1;
const APP_DIR = '.aks-mgmt';
const CONFIG_FILE_NAME = 'config.yml';
const APP_PATH = join(homedir(), APP_DIR);

const getConfigPath = function () {
    return join(APP_PATH, CONFIG_FILE_NAME);
};

const existsConfig = function (configPath) {
    return existsSync(configPath);
};

const readConfigFile = function (path) {
    const file = readFileSync(path, 'utf8');
    return YAML.parse(file);
};

const writeConfigFile = function (path, config) {
    const existingConfig = readConfigFile(path);
    const configString = YAML.stringify(Object.assign(existingConfig, config));
    writeFileSync(path, configString, { encoding: 'utf8' });
};

const initConfig = function () {
    if (!existsSync(APP_PATH)) mkdirSync(APP_PATH);

    const configPath = getConfigPath();
    const configString = YAML.stringify({ version: CONFIG_VERSION });
    writeFileSync(configPath, configString, { encoding: 'utf8' });
};

const readConfig = function () {
    const configPath = getConfigPath();
    if (!existsConfig(configPath)) {
        throw new Error('No config.yml found. Please make sure that you have a valid config at ' + configPath);
    }
    return readConfigFile(configPath);
};

const writeConfig = function (config) {
    const configPath = getConfigPath();
    if (!existsConfig(configPath)) {
        throw new Error('No config.yml found. Please make sure that you have a valid config at ' + configPath);
    }
    writeConfigFile(configPath, config);
};

const get = (prop) => {
    const config = readConfig();
    return config ? config[prop] : null;
};

module.exports = { existsConfig, get, getConfigPath, initConfig, readConfig, writeConfig };