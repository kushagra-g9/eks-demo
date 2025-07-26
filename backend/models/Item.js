// backend/models/Item.js
const mongoose = require('mongoose');

// Define the schema for an Item
const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is a required field
    trim: true,     // Remove whitespace from both ends of a string
  },
  description: {
    type: String,
    required: false, // Description is optional
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the current date when an item is created
  },
});

// Create and export the Mongoose model based on the schema
module.exports = mongoose.model('Item', ItemSchema);
