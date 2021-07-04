# aks-management-cli

## Prerequisites

Make sure you use a Node version of at least `14.1.0`. Besides Node, `Azure CLI` and `kubectl` needs to be installed on your machine.

## Install

`npm install -g @floriandorau/aks-management-cli`

## Usage

```bash
aks <command>

Commands:
  aks config <command>   Manage aks configuration
  aks context <command>  Manage stored context configurations
  aks ip <command>       Manage AKS cluster authorized ip range
  aks completion         Generate completion script

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

You can add multiple context to your config. If the cluster name matches the output of `kubectl config current-context`, `aks` can automatically use the correct settings for cluster name, resource group and its coresponding subscription.

### List configured contexts

If you want to know, which context is already added to you `aks` configuration youn can use the following command.

```bash
aks context list
```

## AKS authorized IP ranges

The main purpose of `aks` is managing the authorized IP ranges of AKS clusters. Therefore it provides the following commands which you can use to modify the authorized ip range of a cluster which matches your currrent `kubectl` context.

```bash
Usage: aks ip <command>

Commands:
  aks ip add-current     Adds your current public ip to AKS authorized ip-ranges
  aks ip add <ip>        Adds <ip> to AKS authorized ip-ranges
  aks ip remove-current  Removes current public ip from AKS authorized ip-ranges if exists
  aks ip remove <ip>     Removes <ip> from AKS authorized ip-ranges
  aks ip show-current    Prints your current public ip address
  aks ip show-range      Prints current authorized ip-range of AKS

Options:
  --version  Show version
  --help     Show help
```

All "_current_" commands will determine you current public IP address and modify the IP range accordingly.
