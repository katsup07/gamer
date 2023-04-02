const express = require('express');
const router = express.Router();
const asyncTryCatchMiddleware = require('../middleware/asyncTryCatchMiddleware');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateId = require('../middleware/validateObjectId');
const {createGame, getGames, getGame, updateGame, deleteGame, validateGame } = require('../models/game-model');

// !! TODO - Add async try/catch middleware to other routes
// == /api/games ==
router.get('/', asyncTryCatchMiddleware( async(req, res) => {
    const games = await getGames();
    res.send(games);
  })
);

router.get('/:id', validateId, asyncTryCatchMiddleware(async(req, res) => {
  const { id } = req.params;
  const game = await getGame(id);
  if(!game) return res.status(404).send('Game could not be found.');
 
  res.send(game);
}));


router.post('/', auth, asyncTryCatchMiddleware(async(req, res) => {
  const { body: game } = req;
  const { error } = validateGame(game);
  if(error) return res.status(400).send(error.details[0].message);
  
  const games = await getGames();
  const gameExists = games.some( g => g.name === game.name);
  if(gameExists) return res.status(400).send('That game is already in database.')

  const gameInDb = await createGame(game)
  res.send(gameInDb);
}));

router.put('/:id', auth, asyncTryCatchMiddleware(async(req, res) => {
  const { id } = req.params;
  const { body: game } = req;
  const { error } = validateGame(game);
  if(error) return res.status(400).send(error.details[0].message);
  
  if(!validateId(id)) return res.status(400).send('Invalid id');
  
  const dbGame = await getGame(id);
  if(!dbGame) return res.status(400).send('No game with the given id was found.')
  // update game
  const updatedGame = await updateGame(id, game);
  res.send(updatedGame);
}));

  router.delete('/:id', [auth, admin], asyncTryCatchMiddleware(async(req, res) =>  {
  const { id } = req.params;

  if(!validateId(id)) return res.status(400).send('Invalid id');

  const game = await getGame(id);
  if(!game) return res.status(404).send('No game with the given id was found.');

  const result = await deleteGame(id); 
  res.send(result);
}));



module.exports = router;