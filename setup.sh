#! /bin/bash
echo -n "Setting Commit Template..."
git config --local commit.template '.github/git_commit_template'
echo "Done"

echo "NODE_ENV='dev'" > .env
echo "VIEWS='./views'" >> .env
echo "COOKIE_KEY='cookie_key_here'" >> .env

mkdir 'db' 2> /dev/null
DB_PATH='./db/users.json' 2> /dev/null
touch "${DB_PATH}"
echo '{}' > "${DB_PATH}" 

echo "USERS_DB='${DB_PATH}'" >> .env

STOPS_PATH='./data/stops.json'

echo "STOPS='${STOPS_PATH}'" >> .env