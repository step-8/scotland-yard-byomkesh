echo "Setting Commit Template..."
git config --local commit.template '.github/git_commit_template'

echo "NODE_ENV='dev'" > .env
echo "VIEWS='./views'" >> .env
echo "COOKIE_KEY='cookie_key_here'" >> .env