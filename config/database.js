'use strict';
const mongoose = require('mongoose'),
    conf = require('./db_conf');

mongoose.connect(`mongodb:\/\/${conf.mongo.host}:${conf.mongo.port}/${conf.mongo.db}`);

mongoose.connection.on('connected', () => {
    console.log(`\x1b[34m Database connected. Database name:\x1b[37m===>\x1b[32m [${conf.mongo.db}]\x1b[33m[${conf.mongo.host}:${conf.mongo.port}]`);
});

mongoose.connection.on('error', (err) => {
    console.log(`\x1b[31m Database error: ${err}`);
});
