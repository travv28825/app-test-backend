const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 5300;
const index_router = require('./routes')

//db
require("./config/database");

// express
const app = express();

//Middlewares
app.use(cors());
app.use(bodyParser.json()).use(
  bodyParser.urlencoded({
    extended: false,
  })
);

//routes
app.use("/api", index_router);

//server up
app.listen(port, () => {
  console.log(
    `\x1b[34m App running on port:\x1b[37m===>\x1b[33m [${port}]`
  );
});

module.exports = app;