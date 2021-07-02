# aks-management-cli

## Prerequisites

Make sure you use a Node version of at least `14.1.0`. Besides Node, `Azure CLI` and `kubectl` needs to be installed on your machine.

## Install

`npm install -g @floriandorau/aks-management-cli`

## Before you start

### Init configuration

Before you can use `aks` you need to set up a application config in your home directory. In order to do so you can use the following command. This will create an empty config file where `aks` will store its configuration.

```bash
aks config init
```

### Add subscriptions to config

To ease your life you could add your relevant `Azure subscriptions` to your `aks` config. Through this you don't need to specifiy supscriptions with each command. Use the following command to add an Azure subscription id with name `development` to your config

```bash
aks subscription add development xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

You can add multiple subscriptions to your config add switch between them.

### Set active subscription

When you added a subscription to your config you can set that subscription afterwards as your active subscription though that it is used automatically with each following command.

```bash
aks subscription set development
```

To see all your configured subscriptions with its name you can run the following command

```bash
aks subscription list
```

## Usage

```bash
$ aks --help

aks <command>

Kommandos:
  aks current-context         Prints your current configured kubectl context
  aks ip <command>            Manage AKS authorized ip range
  aks subscription <command>  Manage stored Azure subscriptions
  aks completion              generate completion script

Optionen:
  --version  Version anzeigen                                                                                                                                                                                                 [boolean]
  --help     Hilfe anzeigen
```
