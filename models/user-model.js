const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 2048,
    required: true,
  },
  isAdmin: {
    type: Boolean,
  }
});


// == User Methods
userSchema.methods.generateAuthToken = function(){
  return jwt.sign( { _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey')); // json token that encrypts _id with secret
}

const User = mongoose.model('User', userSchema);

// == User Collection Utils
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

async function findUserByEmail(email){
  return await User.findOne({email});
}

async function findUserById(id){
  return await User.findById(id).select('-password');// no password returned
}

// == Other User related utils
function validateUser(user) {
	const schema = {
		name: Joi.string().min(5).max(50).required(),
		email: Joi.string().min(5).max(255).email().required(),
		password: Joi.string().min(5).max(1024).required(),
		
	};

	return Joi.validate(user, schema);
}

async function hashPassword(password){
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

return {salt, hashedPassword};
}

module.exports = { User, createUser, getUsers, findUserById, findUserByEmail, isAlreadyInDb, hashPassword, validateUser };