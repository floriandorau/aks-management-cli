const { getCredentials } = require('../src/cli');

exports.command = 'get-credentials';
exports.desc = 'Get access credentials for a managed Kubernetes cluster';

exports.builder = () => { };

exports.handler = () => getCredentials();