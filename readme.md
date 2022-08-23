# SCOTLAND YARD

## __Project description__
_Scotland Yard_ is a exciting multiplayer game
written in javascript.

It is a game for 3-6 players.

Read more about the Game - https://github.com/step-8/scotland-yard-byomkesh/wiki

## __Setup project__

### Clone project into local machine

```
  git clone https://github.com/step-8/scotland-yard-byomkesh.git
```

### Run setup

```
  npm run setup
```

### Install all dependencies

```
  npm install
  brew install redis
```

## Test

### Run test

``` bash
  npm test
```

### Run test in watcher mode

``` bash
  npm run test-w
```

### Run test with coverage

``` bash
  npm run test-c
```

## Start servers

### Start redis server
``` bash
  brew services start redis
```

### Start http server

``` bash
  npm start 
```

## Visit homepage

You can see the home page by *[running the server](#start-server)* on local machine on 
http://localhost:8000

Or visit https://scotland-yard-byomkesh.herokuapp.com/ which is running on heroku
