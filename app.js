const express = require('express');
const mongoose = require('mongoose');
const gameRoutes = require('./routes/games');

mongoose
	.connect('mongodb://localhost/games')
	.then(() => console.log('Connected to MongoDb...'))
	.catch((err) => console.log('Could not connect to MongoDb...', err));
  
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/games', gameRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
