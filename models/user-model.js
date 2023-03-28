const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 256,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  }
}));

async function getUsers(){
  return await User.find();
}

async function isAlreadyInDb(user){
  const users = await getUsers();
  return users.some(u => u.email === user.email);
}

async function createUser({name, email, password}){
  const user = new User({name, email, password});
  return await user.save();
}

function validateUser(user) {
	const schema = {
		name: Joi.string().min(5).max(50).required(),
		email: Joi.string().min(5).max(256).email().required(),
		password: Joi.string().min(5).max(256).required(),
		
	};

	return Joi.validate(user, schema);
}

module.exports = { createUser, getUsers, isAlreadyInDb, validateUser };