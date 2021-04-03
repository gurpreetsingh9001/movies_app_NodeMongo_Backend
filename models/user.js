const Joi = require("joi");
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: {
    type: String, required: true, minlength: 5, maxlength: 255, unique: true    //emails should be unique
  },
  password: { type: String, required: true, minlength: 5, maxlength: 1024 },
  isAdmin: Boolean
});

//we cant use arrow function because they dont have their own "this"
//we use arrow functions for standalone functions //if function is part of object we should not use it
userSchema.methods.generateAuthToken = function () {
  //first argument is payload , second is private key  
  //webtoken will store the details like userID,name,email
  return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
