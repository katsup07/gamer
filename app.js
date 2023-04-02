const express = require('express');
const setErrorLoggingHandlers = require('./startup/errorLogging');
const startDB = require('./startup/db');
const setRoutes = require('./startup/routes');
const configJSONWebToken = require('./startup/config');
const app = express();

// config
configJSONWebToken();
// errors
setErrorLoggingHandlers()
// db
startDB()
// routes
setRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));