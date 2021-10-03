cd /phyproject
docker-compose up --env-file /phyproject/.env.test --force-recreate --build -d
docker image prune -f
