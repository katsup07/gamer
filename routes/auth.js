const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { findUserByEmail} = require('../models/user-model');


// == /api/auth
router.post('/', async(req, res) => {
  const { email, password } = req.body; 
  const { error } = validate({ email, password });
  if(error) return res.status(400).send(error.details[0].message);

  try{
    let user = await findUserByEmail(req.body.email);
    if(!user) return res.status(400).send('Invalid email or password'); // don't share which with client

    const validPassword = await bcrypt.compare(req.body.password, user.password); //(text-password, hashed-password)
    if(!validPassword) return res.status(400).send('Invalid email or password'); 
  
    const token = user.generateAuthToken();// encrypts the user id with jwtSecret
    res.send(token);
  }catch(err){
    res.status(500).send('Something went wrong on the server: ' + err);
  }
});

function validate(req) {
	const schema = {
		email: Joi.string().min(5).max(256).email().required(),
		password: Joi.string().min(5).max(256).required(),
	};

	return Joi.validate(req, schema);
}

module.exports = router;