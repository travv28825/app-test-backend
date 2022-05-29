const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./config/database');
const apiRoutes = require('./routes');
const { APP_PORT } = require('./utils/constants');

const app = express();

app.use(cors());
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: false }));

app.use('/api', apiRoutes);

app.listen(APP_PORT, () => {
  console.log(
    `\x1b[34m App running on port:\x1b[37m===>\x1b[33m [${APP_PORT}]`
  );
});

module.exports = app;
