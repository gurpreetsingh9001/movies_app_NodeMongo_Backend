const { User, validateUser } = require("../models/user");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/me", async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  //shorter method for name:req.body.name ...
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  await user.save();

  //we are creating a JsonWebToken and sending it to user when he registers,so next time if he wants to login he can just send web token to api server instead of login details //it can be done by front end app in its own way
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ["_id", "name", "email"]));  //return as http header
});

module.exports = router;
