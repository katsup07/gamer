const express = require('express');
const router = express.Router();
const { createOrder, getOrders, validateOrder } = require('../models/order-model');

// == api.orders
router.get('/', async(req, res) => {

  res.send(await getOrders());
});

router.post('/', async(req, res) => {
  const {customerId, gameIds} = req.body;
  if(!customerId || !gameIds) return res.status(400).send('Missing customerId or gameIds');

  const { error } = validateOrder({customerId, gameIds})
  if(error) return res.status(400).send(error.details[0].message)

  try{
  const order = await createOrder(customerId, gameIds);
  res.send(order);
  }catch(err){
    res.status(500).send('Something went wrong on the server: '+ err);
  }
});

module.exports = router;