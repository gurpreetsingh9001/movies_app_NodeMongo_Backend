const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 255 },
    isGold: { type: Boolean, default: false },
    phone: { type: String, required: true, minlength: 5, maxlength: 12 }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        phone: Joi.string().min(5).max(12).required(),
        isGold: Joi.boolean()
    });
    return schema.validate(genre);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;