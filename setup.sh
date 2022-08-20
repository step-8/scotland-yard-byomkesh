#! /bin/bash
echo -n "Setting Commit Template..."
git config --local commit.template '.github/git_commit_template'
echo "Done"

echo "NODE_ENV='dev'" > .env
echo "VIEWS='./views'" >> .env
echo "COOKIE_KEY='cookie_key_here'" >> .env
echo "PORT=8000" >> .env

mkdir 'db' 2> /dev/null

STOPS_PATH='./data/stops.json'
echo "STOPS='${STOPS_PATH}'" >> .env

echo "REDIS_HOSTNAME=''">>.env
echo "REDIS_USERNAME=''">>.env
echo "REDIS_PASSWORD=''">>.env
echo "REDIS_PORT=6379">>.env