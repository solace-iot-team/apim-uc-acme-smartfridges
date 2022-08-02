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

echo ">>> Starting database service ..."
docker-compose --env-file="$envFile" up -d
if [[ $? != 0 ]]; then echo ">>> ERROR: docker-compose up failed"; exit 1; fi
echo ">>> Success"

###
# End
