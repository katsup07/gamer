const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const _ = require('lodash');
const { createUser, findUserById, isAlreadyInDb, hashPassword, validateUser } = require('../models/user-model');


// == /api/users
router.post('/', async(req, res) => {
  const { body: userData } = req; 
  const { error } = validateUser(userData);
  if(error) return res.status(400).send(error.details[0].message);

  try{
    if(await isAlreadyInDb(userData)) return res.status(400).send('User already registered');
  
    const user = await createUser(userData);
    const { hashedPassword } = await hashPassword(user.password);
    user.password = hashedPassword;
    user.save();
  
    const token = user.generateAuthToken();// encrypts the user id with jwtSecret
    res.header('x-auth-token', token).send({_id: user._id, name: user.name, email: user.email});
  }catch(err){
    res.status(500).send('Something went wrong on the server: ' + err);
  }
});

router.get('/me', auth, async(req, res) => {
  try{
  const user = await findUserById(req.user._id); // since all auth users will have this after auth middleware
  res.send(user);
  }catch(err){
    res.status(500).send('Something went wrong on the server: ' + err);
  }
});

module.exports = router;