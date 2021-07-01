# aks-management-cli

## Prerequisites

Make sure you use a Node version of at least `14.1.0`. Besides Node, `Azure CLI` and `kubectl` needs to be installed on your machine.

## Install

`npm install -g @floriandorau/aks-management-cli`

## Before you start

In orde to use `aks` properly make sure you setup your config corrertly. Therefore run

```bash
aks config init
```

This will prepare an empty `config.yml` inside your home directory where `aks` stores its configuration.

To ease your life you could or should add your relevant Azure subscriptions to `aks` config. Use this command to do so

```bash
aks subscription add development xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
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
