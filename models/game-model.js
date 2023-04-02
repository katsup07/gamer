const mongoose = require('mongoose');
const Joi = require('joi');

const gameSchema = new mongoose.Schema({
	name: { type: String, required: true, minlength: 3, maxlength: 50 },
	developer: { type: String, required: true, minlength: 3, maxlength: 50 },
	tags: {
    type: [String],
    default: [],
  },
	date: { type: Date, default: Date.now },
	isPublished: { type: Boolean, required: true },
	price: {
		type: Number,
		required: true,
	},
});

const Game = mongoose.model('Game', gameSchema);

async function createGame(newGame) {
	const game = new Game(newGame);
	return await game.save();
}

async function getGames() {
	return await Game.find({}).sort('name');
}

async function getGame(id) {
	return await Game.findById(id);
}

async function updateGame(id, { name, developer, tags = [], isPublished, price }) {
	// == update first
	const result = await Game.findByIdAndUpdate(
		id,
		{
			$set: {
				name,
				developer,
				tags,
				isPublished,
        price
			},
		},
		{ new: true }
	);
	return result;

	// == query first
	// const game = await Game.findById(id);
	// if(!game) return;
	// game.name = 'Elder Scrolls 6';
	// const result = await game.save();
}

async function deleteGame(id) {
	// const result = await Game.deleteOne({_id: id});
	return await Game.findByIdAndRemove(id);
}

// === helpers ===
function validateGame(game) {
	const schema = {
		name: Joi.string().min(3).required(),
		developer: Joi.string().min(3).required(),
		tags: Joi.array().items(Joi.string()),
		isPublished: Joi.boolean().required(),
    price: Joi.number().min(1).max(10000).required()
	};

	return Joi.validate(game, schema);
}

module.exports = {
  Game,
  gameSchema,
	createGame,
	getGames,
	getGame,
	updateGame,
	deleteGame,
	validateGame,
};
