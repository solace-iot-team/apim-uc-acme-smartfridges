#!/usr/bin/env bash

scriptDir=$(cd $(dirname "$0") && pwd);
scriptName=$(basename $(test -L "$0" && readlink "$0" || echo "$0"));

############################################################################################################################
# Settings

dockerProjectName="acme-smartfridges"
dockerComposeFile="$scriptDir/../docker-compose/docker-compose.yml"

############################################################################################################################
# Preapre

export COMPOSE_PROJECT_NAME=$dockerProjectName
export COMPOSE_FILE=$dockerComposeFile

############################################################################################################################
# Run

echo ">>> Stopping database service ..."
docker-compose stop
if [[ $? != 0 ]]; then echo ">>> ERROR: docker-compose stop failed"; exit 1; fi
echo ">>> Success"

###
# End
