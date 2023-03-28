const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { createUser, getUsers, isAlreadyInDb, validateUser } = require('../models/user-model');


// == /api/users
router.get('/', async(req, res) => {
  try{
  res.send(await getUsers())
  }catch(err){
    res.status(500).send('Something went wrong on the server: ' + err);
  }
});

router.post('/', async(req, res) => {
  const { body: user } = req; 
  const { error } = validateUser(user);
  if(error) return res.status(400).send(error.details[0].message);

  try{
  if(await isAlreadyInDb(user)) return res.status(400).send('User already registered');
  
    const userResult = await createUser(user);
    res.send(userResult);
  }catch(err){
    res.status(500).send('Something went wrong on the server: ' + err);
  }
});

module.exports = router;