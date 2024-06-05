set -e
docker exec -i starterkit-be npx kysely migrate:latest
docker exec -i starterkit-be npx kysely seed:run