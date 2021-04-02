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

  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
