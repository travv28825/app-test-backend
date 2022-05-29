const mongoose = require('mongoose');
const config = require('config');
const dbConfig = require('./dbConfig.json');

mongoose.Promise = Promise;
mongoose.connect(
  `mongodb:\/\/${dbConfig.host}:${dbConfig.port}/${config.dbName}`
);

mongoose.connection.on('connected', () => {
  console.log(
    `\x1b[34m Database connected. Database name:\x1b[37m===>\x1b[32m [${config.dbName}]\x1b[33m[localhost:27017]`
  );
});

mongoose.connection.on('error', (err) => {
  console.log(`\x1b[31m Database error: ${err}`);
});
