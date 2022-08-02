#!/usr/bin/env bash

scriptDir=$(cd $(dirname "$0") && pwd);
scriptName=$(basename $(test -L "$0" && readlink "$0" || echo "$0"));

############################################################################################################################
# Settings

envFile="$scriptDir/../.env"

dockerProjectName="acme-smartfridges"
dockerComposeFile="$scriptDir/../docker-compose/docker-compose.yml"

############################################################################################################################
# Prepare

export COMPOSE_PROJECT_NAME=$dockerProjectName
export COMPOSE_FILE=$dockerComposeFile

############################################################################################################################
# Run

echo ">>> Deleting database service ..."
docker-compose --env-file="$envFile" down --volumes
if [[ $? != 0 ]]; then echo ">>> ERROR: docker-compose down failed"; exit 1; fi
echo ">>> Success"

###
# End
