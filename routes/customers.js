const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateId = require('../middleware/validateObjectId');
const { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer, validateCustomer } = require('../models/customer-model');

// == /api/customers ==
router.get('/', async(req, res) =>  {
  try{
  res.send(await getCustomers());
  } catch(err){
    res.status(500).send('Something went wrong on the server ' + err);
  }
});

router.get('/:id', validateId, async(req, res) =>  {
 const { id } = req.params;

 try{
  const customer = await getCustomer(id);
  if(!customer) return res.status(404).send('No customer with given id');

  res.send(customer);
 }catch(err){
  res.status(500).send('Something went wrong on the server ' + err);
 }
});

router.post('/', auth, async(req, res) =>  {
  const { body: customer} = req;
  const { error} = validateCustomer(customer);
  if(error) return res.status(400).send(error.details[0].message);

  try{
  const customers = await getCustomers();
  const customerExists = customers.some(c => c.name === customer.name);
  if(customerExists) return res.status(400).send('A customer with the same name already exists in the database');

  const newCustomer = await createCustomer(customer);
  res.send(newCustomer);
  } catch(err){
    res.status(500).send('Something went wrong on the server ' + err)
  }
});

router.put('/:id', auth, async(req, res) =>  {
  const { body: newCustomerData } = req;
  const { id } = req.params;
 if(!validateId(id)) return res.status(400).send('Invalid id');
 
 const { error } = validateCustomer(newCustomerData)
 if(error) return res.status(400).send(error.details[0].message);

 try{
  const customerInDb = await getCustomer(id);
  if(!customerInDb) return res.status(404).send('No customer with given id');

  const customer = await updateCustomer(id, newCustomerData)
  res.send(customer);
 }catch(err){
  res.status(500).send('Something went wrong on the server ' + err);
 }

});

router.delete('/:id', auth, async(req, res) =>  {
 const { id } = req.params;
 if(!validateId(id)) return res.status(400).send('Invalid id');

 try{
  const customer = await getCustomer(id);
  if(!customer) return res.status(404).send('No customer with given id');

  const result = await deleteCustomer(id);
  res.send(result);
 }catch(err){
  res.status(500).send('Something went wrong on the server ' + err);
 }
});


module.exports = router;