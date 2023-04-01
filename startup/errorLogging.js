const winston = require('winston'); // logs locally
require('winston-mongodb');// logs to mongodb

module.exports = function(){
  process.on('uncaughtException', (ex) => {
    console.log('There was an uncaught exception!!');
    winston.error(ex.message, ex);  
    // process.exit(1)
  });
  
  process.on('unhandledRejection', (ex) => {
    console.log('There was an unhandled promise rejection!!');
    winston.error(ex.message, ex);  
  });
  
  // error logger
  winston.add(winston.transports.File, { filename: 'logfile.log'});
  winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/games', level: "info"});
}