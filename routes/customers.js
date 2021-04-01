const { Customer, validateCustomer } = require('../models/customer');
const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find()
    .select("-__v")
    .sort("name");
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
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

module.exports = router;
