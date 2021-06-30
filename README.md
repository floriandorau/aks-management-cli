# aks-management-cli

## Prerequisites

Make sure you use a Node version of at least `14.1.0`. Besides Node, `Azure CLI` and `kubectl` needs to be installed on your machine.

## Install

`npm install -g @floriandorau/aks-management-cli`

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
