const winston = require('winston');
const express = require('express');
const errorLoggingHandlers = require('./startup/errorLogging');
const startDB = require('./startup/db');
const routes = require('./startup/routes');
const configJSONWebToken = require('./startup/config');
const app = express();

// config
configJSONWebToken();
// errors
errorLoggingHandlers()
// db
startDB()
// routes
routes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));