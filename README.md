# aks-management-cli

[![Build Status](https://app.travis-ci.com/floriandorau/aks-management-cli.svg?branch=main)](https://app.travis-ci.com/floriandorau/aks-management-cli)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=floriandorau_aks-management-cli&metric=alert_status)](https://sonarcloud.io/dashboard?id=floriandorau_aks-management-cli)

`aks` is a command line tool that let you manage the authorized IP ranges of managed AKS clusters. Therefore it uses `Azure CLI` and `kubectl` in the background.

## Prerequisites

Make sure you use a Node version of at least `14.1.0`. Besides Node, `Azure CLI` and `kubectl` needs to be installed on your machine.

## Install

`npm install -g @floriandorau/aks-management-cli`

## Usage

Run `aks --help` to see how to use it.

```bash
aks <command>

Commands:
  aks config <command>   Manage aks configuration
  aks context <command>  Manage aks context configurations
  aks get-credentials    Get access credentials for a managed Kubernetes cluster
  aks ip <command>       Manage authorized ip range of managed Kubernetes cluster
  aks completion         generate completion script

Options:
  --version  Show version
  --help     Show help
```

## Before you start

### Init aks configuration

Before you can use `aks` you need to set up a application config in your home directory. In order to do so you can use the following command. This will create an empty config file where `aks` will store its configuration.

```bash
aks config init
```

### Add context to configuration

At second you need to configure your contexts. With this `aks` can determine which parameters should be used dependent on your current `kubectl` context.

To add a new context in your configuration you can use the following command.

```bash
aks context add {cluster-name} {resource-group} {subscription-id}
```

You can add multiple contexts to your configuration. If the cluster name matches the output of `kubectl config current-context`, `aks` can automatically use the correct settings for cluster name, resource group and its corresponding subscription.

### List configured contexts

If you want to know, which context is already added to your `aks` configuration you can use the following command.

```bash
aks context list
```

## AKS authorized IP ranges

The main purpose of `aks` is managing the authorized IP ranges of AKS clusters. Therefore it provides the following commands which you can use to modify the authorized ip ranges of a cluster which matches your currrent `kubectl` context.

```bash
Usage: aks ip <command>

Commands:
  aks ip add-current     Adds your current public ip to AKS authorized ip-ranges
  aks ip add <ip>        Adds <ip> to AKS authorized ip-ranges
  aks ip clear-range     Clears existing authorized ip-range of AKS
  aks ip remove-current  Removes current public ip from AKS authorized ip-ranges if exists
  aks ip remove <ip>     Removes <ip> from AKS authorized ip-ranges
  aks ip show-current    Prints your current public ip address
  aks ip show-range      Prints current authorized ip-range of AKS

Options:
  --version  Show version
  --help     Show help
```

All "_current_" commands will determine you current public IP address and modify the IP range accordingly.
