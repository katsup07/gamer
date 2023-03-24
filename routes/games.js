const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const {createGame, getGames, getGame, updateGame, deleteGame } = require('../game-model');

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
  const { id } = req.params;
  if(!id) return res.status(400).send('Game id is missing.');
  
  if(!validateId(id)) return res.status(400).send('Invalid id');
  
  try{
  const game = await getGame(id);
  if(!game) return res.status(404).send('Game could not be found.');

  res.send(game);
  } catch(err){
    res.status(500).send('Something went wrong on the server');
  }
});


router.post('/', async(req, res) => {
  const { body: game } = req;
  const { error } = validateGame(game);
  if(error) return res.status(400).send(error.details[0].message);
  
  try{
  const games = await getGames();
  const gameExists = games.some( g => g.name === game.name);
  if(gameExists) return res.status(400).send('That game is already in database.')

  const gameInDb = await createGame(game)
  res.send(gameInDb);
  } catch(err){
    res.status(500).send('Something went wrong on the server');
  }
});

router.put('/:id', async(req, res) => {
  const { id } = req.params;
  const { body: game } = req;
  const { error } = validateGame(game);
  if(error) return res.status(400).send(error.details[0].message);
  
  if(!validateId(id)) return res.status(400).send('Invalid id');
  
  try{
  const dbGame = await getGame(id);
  if(!dbGame) return res.status(400).send('No game with the given id was found.')
  // update game
  const updatedGame = await updateGame(id, game);
  res.send(updatedGame);
  }catch(err){
    res.status(500).send('Something went wrong on the server');
  }
});

router.delete('/:id', async(req, res) =>  {
  const { id } = req.params;
  try{
  if(!validateId(id)) return res.status(400).send('Invalid id');
  const game = await getGame(id);
  if(!game) return res.status(404).send('No game with the given id was found.');


  const result = await deleteGame(id); 
  res.send(result);
  }catch(err){
    res.status(500).send('Something went wrong on the server');
  }
});

// === helpers ===
function validateId(id){
  return mongoose.Types.ObjectId.isValid(id);
}

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