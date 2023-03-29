const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {createGame, getGames, getGame, updateGame, deleteGame, validateGame, validateId } = require('../models/game-model');

// == /api/games ==
router.get('/', async(req, res) => {
  try{
  const games = await getGames();
  res.send(games);
  } catch(err){
   res.status(500).send('Something went wrong on the server: ' + err);
  }
});

router.get('/:id', async(req, res) => {
  const { id } = req.params;
  
  if(!validateId(id)) return res.status(400).send('Invalid id');
  
  try{
  const game = await getGame(id);
  if(!game) return res.status(404).send('Game could not be found.');
 
  res.send(game);
  } catch(err){
    res.status(500).send('Something went wrong on the server: ' + err);
  }
});


router.post('/', auth, async(req, res) => {

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
    res.status(500).send('Something went wrong on the server: ' + err);
  }
});

router.put('/:id', auth, async(req, res) => {
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
    res.status(500).send('Something went wrong on the server: ' + err);
  }
});

router.delete('/:id', [auth, admin], async(req, res) =>  {
  const { id } = req.params;
  try{
  if(!validateId(id)) return res.status(400).send('Invalid id');

  const game = await getGame(id);
  if(!game) return res.status(404).send('No game with the given id was found.');

  const result = await deleteGame(id); 
  res.send(result);
  }catch(err){
    res.status(500).send('Something went wrong on the server: '+ err);
  }
});



module.exports = router;