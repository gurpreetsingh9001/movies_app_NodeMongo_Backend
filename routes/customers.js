const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 255 },
  isGold: { type: Boolean, default: false },
  phone: { type: String, required: true, minlength: 5, maxlength: 12 }
});

const Customer = mongoose.model('Customer', customerSchema);

router.get("/", async (req, res) => {
  const customers = await Customer.find()
    .select("-__v")
    .sort("name");
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomers(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  customer = await customer.save();

  res.send(customer);
});


router.get("/:id", async (req, res) => {

  try {
    const customer = await Customer.findById(req.params.id).select("-__v");
    res.send(customer);
  }
  catch (err) {
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");
  }

});

function validateCustomers(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    phone: Joi.string().min(5).max(12).required(),
    isGold: Joi.boolean()
  });
  return schema.validate(genre);
}

module.exports = router;
