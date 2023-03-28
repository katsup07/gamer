const express = require('express');
const mongoose = require('mongoose');
const gameRoutes = require('./routes/games');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');


mongoose
	.connect('mongodb://localhost/games')
	.then(() => console.log('Connected to MongoDb...'))
	.catch((err) => console.log('Could not connect to MongoDb...', err));
  
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/games', gameRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
