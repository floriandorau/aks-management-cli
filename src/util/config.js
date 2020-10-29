const YAML = require('yaml');

const { join } = require('path');
const { homedir } = require('os');
const { existsSync, readFileSync, writeFileSync } = require('fs');

const APP_DIR = '.aks-mgmt';
const CONFIG_FILE_NAME = 'config.yml';
const APP_PATH = join(homedir(), APP_DIR);

const readConfigFile = function (path) {
    const file = readFileSync(path, 'utf8');
    return YAML.parse(file);
};

const writeConfigFile = function (path, config) {
    const existingConfig = readConfigFile(path);
    const configString = YAML.stringify(Object.assign(existingConfig, config));
    writeFileSync(path, configString, { encoding: 'utf8' });
};

const readConfig = function () {
    const configPath = _getConfigPath();
    return readConfigFile(configPath);
};

const writeConfig = function (config) {
    const configPath = _getConfigPath();
    writeConfigFile(configPath, config);
};

const _getConfigPath = function () {
    const configPath = join(APP_PATH, CONFIG_FILE_NAME);

    if (!existsSync(configPath)) {
        throw new Error('No config.yml found. Please make sure that you have a valid config at ' + configPath);
    }

    return configPath;
};

const get = (prop) => {
    const config = readConfig();
    return config ? config[prop] : null;
};

module.exports = { get, readConfig, writeConfig };