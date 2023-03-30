const config = require('config');
const winston = require('winston'); // logs locally
require('winston-mongodb');// logs to mongodb
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/error');

const gameRoutes = require('./routes/games');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// error logger
winston.add(winston.transports.File, { filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/games'});

if(!config.get('jwtPrivateKey')){ 
  console.error('FATAL ERROR! jwtPrivateKey is not defined.');
  process.exit(1); // 0 = success , 1 = failure
}

mongoose
	.connect('mongodb://localhost/games')
	.then(() => console.log('Connected to MongoDb...'))
	.catch((err) => console.log('Could not connect to MongoDb...', err));
  
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/api/games', gameRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
