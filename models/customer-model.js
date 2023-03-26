const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 5,
		maxlength: 50,
		required: true,
	},
	phone: {
		type: String,
    minlength: 5,
		maxlength: 50,
		required: true,
	},
	isGold: { type: Boolean, default: false },
});

const Customer = mongoose.model('Customer', customerSchema);

async function createCustomer(customerData){
  const customer = new Customer(customerData);
  return await customer.save();
}

async function getCustomers(){
  return await Customer.find();
}

async function getCustomer(id){
  return await Customer.findById(id);
}

async function updateCustomer(id, {name, phone, isGold}){
  if(!isGold) isGold = false;
  return await Customer.findByIdAndUpdate(
		id,
		{
			$set: {
				name,
				phone,
				isGold,
			},
		},
		{ new: true }
	);
}

async function deleteCustomer(id){
  return await Customer.findByIdAndRemove(id);
}

// === Helpers
function validateId(id){
  return mongoose.Types.ObjectId.isValid(id);
}

function validateCustomer(customer){
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  };

  return Joi.validate(customer, schema);
}



module.exports = { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer, validateId, validateCustomer };
