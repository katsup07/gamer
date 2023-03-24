const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {Game, createGame, getGames, getGame, updateGame, deleteGame } = require('../game-model');

// == /api/games ==
router.get('/', async(req, res) => {
  try{
  const games = await getGames();
  res.send(games);
  } catch(err){
    console.log(err);
    res.status(500).send('Something went wrong on the server');
  }
});

router.get('/:id', async(req, res) => {
  console.log(req.params);
  const { id } = req.params;
  if(!id) return res.status(400).send('Game id is missing. Must be included to get game.');

  const game = await getGame(id);
  if(!game) return res.status(404).send('Game could not be found.');

  res.send(game);
});

router.post('/', async(req, res) => {
  const { body: game } = req;
  console.log('req.body: ', game);
  const { error } = validateGame(game);
  if(error) return res.status(400).send(error.details[0].message);

  const games = await getGames();
  const gameExists = games.some( g => g.name === game.name);
  if(gameExists) return res.status(400).send('That game is already in database.')

  const result = await createGame(game)
  res.send(result);
});

router.put('/:id', async(req, res) => {
  const { id } = req.params;
  const { body: game } = req;
  const { error } = validateGame(game);
  if(error) return res.status(400).send(error.details[0].message);

  const dbGame = await getGame(id);
  if(!dbGame) return res.status(400).send('No game with the given id was found.')
  // update game
  const updatedGame = await updateGame(id, game);
  res.send(updatedGame);
});

router.delete('/:id', (req, res) =>  {
  const { id } = req.params;
  const genre = genres.find( genre => genre.id === +id);
  if(!genre) return res.status(404).send('No genre with the given id was found.');

  const index = genres.findIndex(genre => genre.id === id);
  genres.splice(index, 1);
  res.send(genre);
});

function validateGame(game){
  const schema = {
    name: Joi.string().min(3).required(),
    developer: Joi.string().min(2).required(),
    tags: Joi.array().items(Joi.string()),
    isPublished: Joi.boolean().required()
  };

  return Joi.validate(game, schema);
}

module.exports = router;