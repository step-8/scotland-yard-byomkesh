#! /bin/bash
echo -n "Setting Commit Template..."
git config --local commit.template '.github/git_commit_template'
echo "Done"

echo "NODE_ENV='dev'" > .env
echo "VIEWS='./views'" >> .env
echo "COOKIE_KEY='cookie_key_here'" >> .env
echo "PORT=8000" >> .env

mkdir 'db' 2> /dev/null


DB_PATH='./db/users.json' 2> /dev/null
echo '{}' > "${DB_PATH}" 
echo "USERS_DB='${DB_PATH}'" >> .env

STOPS_PATH='./data/stops.json'
echo "STOPS='${STOPS_PATH}'" >> .env

SESSION_FILE_PATH='./db/session.json'
echo "SESSION_FILE='${SESSION_FILE_PATH}'" >> .env
echo '{}' > $SESSION_FILE_PATH


GAMES_PATH='./db/games.json'
echo '{"games":[], "newGameId":1}' > "${GAMES_PATH}"
echo "GAMES_DB='${GAMES_PATH}'" >> .env