const mongoose = require('mongoose');
const Joi = require('joi');
const { customerSchema, getCustomer } = require('./customer-model');
const { gameSchema, getGame } = require('./game-model');

const orderSchema = new mongoose.Schema({
	customer: {
		type: customerSchema,
		required: true,
	},
	games: {
		type: [gameSchema],
		required: true,
	},
	total: {
		type: Number,
		required: true,
		min: 0,
		max: 100000,
	},
	date: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

const Order = mongoose.model('Order', orderSchema);

async function createOrder(customerId, gameIds) {
	const customer = await getCustomer(customerId);

	let totalPrice = 0;
	let games = [];
	for (let gameId of gameIds) {
		const game = await getGame(gameId);
		totalPrice += game.price;
		games.push(game);
	}

	const order = new Order({
		customer,
		games,
		total: totalPrice.toFixed(2),
	});

	return await order.save();
}

async function getOrders() {
	return await Order.find()
		.select('games.name')
		.select('games.price')
		.select('customer.name')
		.select('customer.isGold')
		.select('customer.total')
    .select('total')
    .select('date')
    .sort('-date');
}

function validateOrder(order) {
	const schema = {
		customerId: Joi.string().length(24).required(),
		gameIds: Joi.array().items(Joi.string().length(24)).required(),
	};

	return Joi.validate(order, schema);
}

module.exports = { createOrder, getOrders, validateOrder };
