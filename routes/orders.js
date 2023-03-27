const express = require('express');
const router = express.Router();
const { createOrder, getOrders, validateOrder } = require('../models/order-model');
const { getCustomer } = require('../models/customer-model');
const { getGame } = require('../models/game-model');

// == api.orders
router.get('/', async(req, res) => {
  try{
  res.send(await getOrders());
  }catch(err){
    res.status(500).send('Something went wrong on the server: '+ err);
  }
});

router.post('/', async(req, res) => {
  const {customerId, gameIds} = req.body;
  if(!customerId || !gameIds) return res.status(400).send('Missing customerId or gameIds');

  const { error } = validateOrder({customerId, gameIds})
  if(error) return res.status(400).send(error.details[0].message)

  try{
  const customer = await getCustomer(customerId);
  if(!customer) return res.status(404).send('Customer not found in database for customerId: ' + customerId);
  
  let game;
  for(let gameId of gameIds){
    game = await getGame(gameId);
    if(!game) return res.status(404).send('Game not found in database for gameId: ' + gameId);
  }
  
  const order = await createOrder(customerId, gameIds);
  res.send(order);
  }catch(err){
    res.status(500).send('Something went wrong on the server: '+ err);
  }
});

module.exports = router;