const express = require('express');
const errorHandler = require('../middleware/error');
const gameRoutes = require('../routes/games');
const customerRoutes = require('../routes/customers');
const orderRoutes = require('../routes/orders');
const userRoutes = require('../routes/users');
const authRoutes = require('../routes/auth');
const cors = require('cors');

module.exports = function (app) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cors({ origin: '*' }));

	app.use('/api/games', gameRoutes);
	app.use('/api/customers', customerRoutes);
	app.use('/api/orders', orderRoutes);
	app.use('/api/users', userRoutes);
	app.use('/api/auth', authRoutes);

	app.use(errorHandler);
};
