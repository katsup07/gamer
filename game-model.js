const mongoose = require('mongoose');

mongoose
	.connect('mongodb://localhost/games')
	.then(() => console.log('Connected to MongoDb...'))
	.catch((err) => console.log('Could not connect to MongoDb...', err));

const gameSchema = new mongoose.Schema({
	name: String,
	developer: String,
	tags: [String],
	date: { type: Date, default: Date.now },
	isPublished: Boolean,
});

const Game = mongoose.model('Game', gameSchema);

async function createGame(newGame) {
	const game = new Game(newGame);
	return await game.save();
}

async function getGames() {
	return await Game.find({});
}

async function getGame(id) {
	return await Game.findById(id);
}

async function updateGame(id, { name, developer, tags, isPublished }) {
	// == update first
	const result = await Game.findByIdAndUpdate(
		id,
		{
			$set: {
				name,
				developer,
				tags,
				isPublished,
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

module.exports = {
	Game,
	createGame,
	getGames,
	getGame,
	updateGame,
	deleteGame,
};
