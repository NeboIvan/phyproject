#!/bin/sh

cd /phyproject

curl -O docker-compose.yml https://raw.githubusercontent.com/NeboIvan/phyproject/master/docker-compose.yml?token=********

docker-compose up --force-recreate --build -d
docker image prune -f
