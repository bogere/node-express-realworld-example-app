var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');


var CategorySchema = new mongoose.Schema({
   title: {type: String, lowercase: true, unique: true, required: true},
   description: {type: String, required: true},
   parentCategory: {type: String, default: null }, // null if it is not child of any category
   author: {type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true},
},  {timestamps: true})

CategorySchema.plugin(uniqueValidator, {message: 'is already taken'});

mongoose.model('Category', CategorySchema)