# NodeJSRedisMessenger
NodeJS message generator and receiver written with Redis

### Setup
```sh
npm install
```

### Run
To run in silent mode (all info and messages will be written in app.log file):
```sh
node index.js
```
To run in debug mode (all info and messages will be written in console and app.log file):
```sh
node index.js --debug
```
To run in force mode - it sets generator timeout to zero and runs 100 bots:
```sh
node index.js --force --debug 
```
To run in errors reader mode:
```sh
node index.js --getErrors
```