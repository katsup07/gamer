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

async function createGame(){
  const game = new Game({
    name: 'Elder Scrolls 6',
    developer: 'Bethesda Game Studios',
    tags: ['fantasy', 'rpg', 'open world'],
    isPublished: false,
  });
  console.log('awaiting result...');
  const result = await game.save();
  console.log(result);
}

createGame();